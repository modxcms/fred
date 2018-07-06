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

    function process()
    {
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        if (empty($id)) {
            return $this->failure('No id was provided');
        }


        /** @var \modResource $object */
        $object = $this->modx->getObject('modResource', $id);
        if (!$object instanceof \modResource) {
            return $this->failure('Could not load resource with id ' . $id);
        }
        
        $this->loadTagger();

        $data = $object->getProperty('data', 'fred');
        $fingerprint = !empty($data['fingerprint']) ? $data['fingerprint'] : '';
        $elements = [];

        $this->gatherElements($elements, $data);

        $pageSettings = [
            'pagetitle' => $object->pagetitle,
            'longtitle' => $object->longtitle,
            'description' => $object->description,
            'introtext' => $object->introtext,
            'menutitle' => $object->menutitle,
            'alias' => $object->alias,
            'published' => $object->published == 1,
            'hidemenu' => $object->hidemenu == 1,
            'menuindex' => (int)$object->menuindex,
            'publishedon' => $object->publishedon,
            'publishon' => $object->pub_date,
            'unpublishon' => $object->unpub_date,
            'tagger' => $this->getTaggerTags($object)
        ];
        
        return $this->data([
            "pageSettings" => $pageSettings,
            "data" => $data,
            "elements" => $elements,
            "tagger" => $this->getTagger($object),
            "fingerprint" => $fingerprint
        ]);
    }

    protected function gatherElements(&$elements, $dropZones)
    {
        foreach ($dropZones as $dropZone) {
            if(!is_array($dropZone)) continue;
            foreach ($dropZone as $element) {
                $elementId = intval($element['widget']);

                if (!isset($elements[$elementId])) {
                    $elements[$elementId] = $this->getElement($elementId);
                }

                $this->gatherElements($elements, $element['children']);
            }
        }
    }

    protected function getElement($id)
    {
        /** @var \modChunk $chunk */
        $chunk = $this->modx->getObject('modChunk', $id);
        if (!$chunk) {
            $this->modx->log(\modX::LOG_LEVEL_ERROR, "[Fred] Chunk {$id} wasn't found.");
            return ['html' => '', 'options' => [], 'title' => ''];
        }

        $matches = [];
        preg_match('/image:([^\n]+)\n?/', $chunk->description, $matches);

        $image = '';
        $options = [];
        $description = $chunk->description;

        if (count($matches) == 2) {
            $image = $matches[1];
            $description = str_replace($matches[0], '', $description);
        }

        $matches = [];
        preg_match('/options:([^\n]+)\n?/', $description, $matches);

        if (count($matches) == 2) {
            $options = $this->modx->getChunk($matches[1]);
            $options = json_decode($options, true);
            if (empty($options)) $options = [];

            $globalRte = $this->fred->getOption('rte_config');
            if (!empty($globalRte)) {
                $globalRte = $this->modx->getChunk($globalRte);
                $globalRte = json_decode($globalRte, true);
                
                if (!empty($globalRte)) {
                    $rteConfig = $globalRte;
                    
                    if (!empty($options['rteConfig'])) {
                        $rteConfig = array_merge($rteConfig, $options['rteConfig']);
                    }

                    $options['rteConfig'] = $rteConfig;
                }
            }
            
            $description = str_replace($matches[0], '', $description);
        }

        return [
            'html' => $chunk->content,
            'title' => $chunk->name,
            'options' => $options
        ];
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
