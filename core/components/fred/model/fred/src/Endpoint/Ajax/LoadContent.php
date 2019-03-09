<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fred\Endpoint\Ajax;

class LoadContent extends Endpoint
{
    protected $allowedMethod = ['GET', 'OPTIONS'];
    
    /** @var \FredTheme */
    private $theme;

    private $categoryThemeMap = [];

    function process()
    {
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        if (empty($id)) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_ns_id'));
        }

        if (!$this->verifyClaim('resource', $id)) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_invalid_id'));
        }

        /** @var \modResource $object */
        $object = $this->modx->getObject('modResource', $id);
        if (!$object instanceof \modResource) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_nf_id', ['id' => $id]));
        }

        $this->theme = $this->fred->getTheme($object->template);
        
        $this->loadTagger();

        $data = $object->getProperty('data', 'fred');
        $plugins = $object->getProperty('plugins', 'fred');
        if (empty($plugins)) $plugins = [];
        
        $fingerprint = !empty($data['fingerprint']) ? $data['fingerprint'] : '';
        $elements = [];

        $this->gatherElements($elements, $data);
        $TVs = $this->gatherTVs($object); 

        $pageSettings = [
            'pagetitle' => $object->pagetitle,
            'longtitle' => $object->longtitle,
            'description' => $object->description,
            'introtext' => $object->introtext,
            'menutitle' => $object->menutitle,
            'alias' => $object->alias,
            'published' => $object->published == 1,
            'deleted' => $object->deleted == 1,
            'hidemenu' => $object->hidemenu == 1,
            'menuindex' => (int)$object->menuindex,
            'publishedon' => $object->publishedon,
            'publishon' => $object->pub_date,
            'unpublishon' => $object->unpub_date,
            'tagger' => $this->getTaggerTags($object),
            'tvs' => (object)$TVs['values']
        ];
        
        return $this->data([
            "pageSettings" => $pageSettings,
            "data" => $data,
            "plugins" => (object)$plugins,
            "elements" => $elements,
            "tagger" => $this->getTagger($object),
            "tvs" => $TVs['def'],
            "fingerprint" => $fingerprint
        ]);
    }

    protected function gatherElements(&$elements, $dropZones)
    {
        foreach ($dropZones as $dropZone) {
            if(!is_array($dropZone)) continue;
            foreach ($dropZone as $element) {
                $elementId = $element['widget'];

                if (!isset($elements[$elementId])) {
                    $elements[$elementId] = $this->getElement($elementId);
                }

                $this->gatherElements($elements, $element['children']);
            }
        }
    }

    protected function getElement($uuid)
    {
        /** @var \FredElement $element */
        $element = $this->modx->getObject('FredElement', ['uuid' => $uuid]);
        if (!$element) {
            $this->modx->log(\modX::LOG_LEVEL_ERROR, "[Fred] Element {$uuid} wasn't found.");
            return [];
        }

        $invalidTheme = false;
        if ($this->theme) {
            $categoryId = $element->get('category');
            $elementTheme = null;
            
            if (!isset($this->categoryThemeMap[$categoryId])) {
                $category = $element->Category;
                if ($category) {
                    $this->categoryThemeMap[$categoryId] = $category->get('theme');
                    $elementTheme = $this->categoryThemeMap[$categoryId];
                }
            } else {
                $elementTheme = $this->categoryThemeMap[$categoryId];
            }
            
            if ($elementTheme) {
                if ($elementTheme !== $this->theme->id) {
                    $invalidTheme = true;
                }
            }
            
        }

        return [
            "title" => $element->name,
            "html" => $element->content,
            "invalidTheme" => $invalidTheme,
            "options" => $element->processOptions()
        ];
    }

    /**
     * @param \modResource $resource
     * @return array
     */
    protected function gatherTVs($resource)
    {
        $output = [
            'values' => [],
            'def' => []
        ];
        
        $tvs = $resource->getTemplateVars();
        
        foreach ($tvs as $tv) {
            $props = $tv->getProperties();
            
            if (isset($props['fred']) && (intval($props['fred']) === 1)) {
                $def = [
                    'name' => $tv->name,
                    'label' => $tv->caption,
                    'type' => 'text'
                ];
                
                if (!empty($props['fred.type'])) {
                    $def['type'] = $props['fred.type'];    
                }

                if (!empty($props['fred.mediaSource'])) {
                    $def['mediaSource'] = $props['fred.mediaSource'];
                }
                
                $output['def'][] = $def;
                $output['values'][$tv->name] = $tv->value;       
            }
        }
        
        return $output; 
    }
    
    /**
     * @param \modResource $resource
     * @return array
     */
    protected function getTagger($resource)
    {
        if (!$this->taggerLoaded) return [];
        
        $c = $this->modx->newQuery('TaggerGroup');
        $c->sortby('position');
        /** @var \TaggerGroup[] $groups */
        $groups = $this->modx->getIterator('TaggerGroup', $c);
        $groupsArray = [];
        
        foreach ($groups as $group) {
            $showForTemplates = $group->show_for_templates;
            $showForTemplates = $this->tagger->explodeAndClean($showForTemplates, ',', true);

            $showForContexts = $group->show_for_contexts;
            $showForContexts = $this->tagger->explodeAndClean($showForContexts);

            if (!in_array($resource->template, $showForTemplates)) continue;
            if (!empty($showForContexts) && !in_array($resource->context_key, $showForContexts)) continue;
            
            $groupsArray[] = array_merge($group->toArray(), [
                'show_for_templates' => array_values($showForTemplates),
                'show_for_contexts' => array_values($showForContexts),
                'tags' => ($group->show_autotag === 1) ? $this->taggerGetTagsForGroup($group) : []
            ]);
        }

        return $groupsArray;
    }

    protected function getTaggerTags($resource)
    {
        if (!$this->taggerLoaded) return [];
        
        $tagsArray = [];
    
        $c = $this->modx->newQuery('TaggerTagResource');
        $c->leftJoin('TaggerTag', 'Tag');
        $c->where(['resource' => $resource->id]);
        $c->sortby('Tag.alias', 'ASC');
    
        $c->select($this->modx->getSelectColumns('TaggerTagResource', 'TaggerTagResource', '', ['resource']));
        $c->select($this->modx->getSelectColumns('TaggerTag', 'Tag', '', ['tag', 'group']));
    
        $c->prepare();
        $c->stmt->execute();
        
        while($relatedTag = $c->stmt->fetch(\PDO::FETCH_ASSOC)) {
            if (!isset($tagsArray['tagger-' . $relatedTag['group']])) {
                $tagsArray['tagger-' . $relatedTag['group']] = [$relatedTag['tag']];
            } else {
                $tagsArray['tagger-' . $relatedTag['group']][] = $relatedTag['tag'];
            }
        }

        return $tagsArray;
    }
    
    protected function taggerGetTagsForGroup($group)
    {
        if (!$this->taggerLoaded) return [];
        
        $c = $this->modx->newQuery('TaggerTag');
        $c->where(['group' => $group->id]);
        
        $sortDir = (strtolower($group->sort_dir) === 'asc') ? 'ASC' : 'DESC';
        
        if ($group->sort_field === 'alias') {
            $c->sortby('TaggerTag.alias', $sortDir);    
        } else {
            $c->sortby('TaggerTag.rank', $sortDir);
        }
        
        $c->select($this->modx->getSelectColumns('TaggerTag', 'TaggerTag', '', ['tag']));
    
        $c->prepare();
        
        $c->stmt->execute();
        
        return $c->stmt->fetchAll(\PDO::FETCH_COLUMN, 0);
    }
}
