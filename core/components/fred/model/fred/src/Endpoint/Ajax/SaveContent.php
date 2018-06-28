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

use Fred\Utils;

class SaveContent extends Endpoint
{
    protected $taggerLoaded = false;
    protected $tagger = null;
    
    function process()
    {
        if (!isset($this->body['id'])) {
            return $this->failure('No id was provided');
        }

        if (!isset($this->body['data'])) {
            return $this->failure('No data was provided');
        }

        /** @var \modResource $object */
        $object = $this->modx->getObject('modResource', (int)$this->body['id']);
        if (!$object instanceof \modResource) {
            return $this->failure('Could not load resource with id ' . (int)$this->body['id']);
        }

        if (!$object->checkPolicy('save')) {
            return $this->failure('Permission denied (save)');
        }

        $this->loadTagger();
        
        if (isset($this->body['content'])) {
            $content = $this->body['content'];
            $parser = $this->modx->getParser();
            
            $content = Utils::htmlDecodeTags($content, $parser);
            
            $object->setContent($content);
        }

        if (isset($this->body['pageSettings']['introtext'])) {
            $object->set('introtext', $this->body['pageSettings']['introtext']);
        }

        if (isset($this->body['pageSettings']['description'])) {
            $object->set('description', $this->body['pageSettings']['description']);
        }

        if (isset($this->body['pageSettings']['pagetitle'])) {
            $object->set('pagetitle', $this->body['pageSettings']['pagetitle']);
        }

        if (isset($this->body['pageSettings']['menutitle'])) {
            $object->set('menutitle', $this->body['pageSettings']['menutitle']);
        }

        if (isset($this->body['pageSettings']['longtitle'])) {
            $object->set('longtitle', $this->body['pageSettings']['longtitle']);
        }

        if (isset($this->body['pageSettings']['menuindex'])) {
            $object->set('menuindex', (integer)$this->body['pageSettings']['menuindex']);
        }

        if (isset($this->body['pageSettings']['hidemenu'])) {
            $object->set('hidemenu', (boolean)$this->body['pageSettings']['hidemenu']);
        }
        
        if (isset($this->body['pageSettings']['publishon'])) {
            $object->set('pub_date', (int)$this->body['pageSettings']['publishon']);
        }
        
        if (isset($this->body['pageSettings']['unpublishon'])) {
            $object->set('unpub_date', (int)$this->body['pageSettings']['unpublishon']);
        }

        $uriChanged = false;
        if (isset($this->body['pageSettings']['alias'])) {
            $object->set('alias', $this->body['pageSettings']['alias']);
            $uriChanged = $object->isDirty('alias');
        }

        if (isset($this->body['pageSettings']['published'])) {
            if (!$object->checkPolicy('publish')) {
                return $this->failure('Permission denined (publish)');
            }

            $currentValue = (boolean)$object->get('published');
            $incomingValue = (boolean)$this->body['pageSettings']['published'];
            if ($incomingValue !== $currentValue) {
                $object->set('published', (boolean)$this->body['pageSettings']['published']);
                $object->set('publishedon', $currentValue ? time() : false);
            }
        }

        if (isset($this->body['pageSettings']['publishedon'])) {
            $object->set('publishedon', (int)$this->body['pageSettings']['publishedon']);
        }

        $object->setProperty('data', $this->body['data'], 'fred');

        $object->set('editedon', time());
        $object->set('editedby', $this->modx->user->get('id'));

        if ($this->taggerLoaded) {
            $this->handleTagger($object);
        }
        
        $saved = $object->save();

        if (!$saved) {
            return $this->failure('Error saving resource with id ' . $object->get('id'));
        }

        $this->modx->getCacheManager()->refresh();

        $response = ['message' => 'Save successful'];
        if ($uriChanged) {
            $response['url'] = $this->modx->makeUrl($object->get('id'), $object->get('context_key'), '', 'full');
        }

        return $this->success($response);
    }

    protected function loadTagger()
    {
        $taggerCorePath = $this->modx->getOption('tagger.core_path', null, $this->modx->getOption('core_path') . 'components/tagger/');

        if (!file_exists($taggerCorePath . 'model/tagger/tagger.class.php')) {
            return;
        }

        $this->tagger = $this->modx->getService('tagger', 'Tagger', $taggerCorePath . 'model/tagger/');
        if (!($this->tagger instanceof \Tagger)) return;

        $this->taggerLoaded = true;
    }

    /**
     * @param \modResource $resource
     */
    protected function handleTagger($resource) {
        /** @var \TaggerGroup[] $groups */
        $groups = $this->modx->getIterator('TaggerGroup');
        foreach ($groups as $group) {
            $showForTemplates = $group->show_for_templates;
            $showForTemplates = $this->tagger->explodeAndClean($showForTemplates);
            $showForTemplates = array_flip($showForTemplates);

            $showForContexts = $group->show_for_contexts;
            $showForContexts = $this->tagger->explodeAndClean($showForContexts);
            $showForContexts = array_flip($showForContexts);
            
            if (!isset($showForTemplates[$resource->template])) {
                continue;
            }

            if (!empty($showForContexts) && !isset($showForContexts[$resource->context_key])) {
                continue;
            }
            
            $oldTagsQuery = $this->modx->newQuery('TaggerTagResource');
            $oldTagsQuery->leftJoin('TaggerTag', 'Tag');
            $oldTagsQuery->where(['resource' => $resource->id, 'Tag.group' => $group->id]);
            $oldTagsQuery->select($this->modx->getSelectColumns('TaggerTagResource', 'TaggerTagResource', '', ['tag']));
            
            $oldTagsQuery->prepare();
            $oldTagsQuery->stmt->execute();
            
            $oldTags = $oldTagsQuery->stmt->fetchAll(\PDO::FETCH_COLUMN, 0);
            $oldTags = array_flip($oldTags);

            if (isset($this->body['pageSettings']['tagger']['tagger-' . $group->id])) {
                $tags = $this->body['pageSettings']['tagger']['tagger-' . $group->id];
                $tags = array_map('trim', $tags);
                $tags = array_keys(array_flip($tags));
                
                if ($group->tag_limit > 0) {
                    $tags = array_slice($tags, 0, $group->tag_limit);
                }
            } else {
                continue;
            }
            
            foreach ($tags as $tag) {
                /** @var \TaggerTag $tagObject */
                $tagObject = $this->modx->getObject('TaggerTag', array('tag' => $tag, 'group' => $group->id));
                if ($tagObject) {
                    $existsRelation = $this->modx->getObject('TaggerTagResource', array('tag' => $tagObject->id, 'resource' => $resource->id));
                    if ($existsRelation) {
                        if (isset($oldTags[$existsRelation->tag])) {
                            unset($oldTags[$existsRelation->tag]);
                        }
                        continue;
                    }
                }
                if (!$tagObject) {
                    if (!$group->allow_new) {
                        continue;
                    }
                    
                    $tagObject = $this->modx->newObject('TaggerTag');
                    $tagObject->set('tag', $tag);
                    $tagObject->addOne($group, 'Group');
                    $tagObject->save();
                }
                
                /** @var \TaggerTagResource $relationObject */
                $relationObject = $this->modx->newObject('TaggerTagResource');
                $relationObject->set('tag', $tagObject->id);
                $relationObject->set('resource', $resource->id);
                $relationObject->save();
            }
            
            if (count($oldTags) > 0) {
                $oldTags = array_keys($oldTags);
                $this->modx->removeCollection('TaggerTagResource', array(
                    'tag:IN' => $oldTags,
                    'AND:resource:=' => $resource->id
                ));
            }
            
            if ($group->remove_unused) {
                $c = $this->modx->newQuery('TaggerTagResource');
                $c->select($this->modx->getSelectColumns('TaggerTagResource', 'TaggerTagResource', '', array('tag')));
                $c->prepare();
                $c->stmt->execute();
                $IDs = $c->stmt->fetchAll(\PDO::FETCH_COLUMN, 0);
                $IDs = array_keys(array_flip($IDs));
                if (count($IDs) > 0) {
                    $this->modx->removeCollection('TaggerTag', array('id:NOT IN' => $IDs, 'group' => $group->id));
                }
            }
        }
    }
}
