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
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_ns_id'));
        }
        
        $id = (int)$this->body['id'];

        if (!$this->verifyClaim('resource', $id)) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_invalid_id'));
        }

        if (!isset($this->body['data'])) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_ns_data'));
        }

        /** @var \modResource $object */
        $object = $this->modx->getObject('modResource', $id);
        if (!$object instanceof \modResource) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_nf_id', ['id' => $id]));
        }

        if (!$this->modx->hasPermission('save_document') || !$object->checkPolicy('save')) {
            return $this->failure($this->modx->lexicon('fred.fe.err.permission_denied'));
        }
        
        $data = $object->getProperty('data', 'fred');
        if (!empty($data['fingerprint'])) {
            if (empty($this->body['fingerprint'])) {
                return $this->failure('No fingerprint was provided.');    
            }
            
            if ($data['fingerprint'] !== $this->body['fingerprint']) {
                return $this->failure($this->modx->lexicon('fred.fe.err.resource_stale'));
            }
        }

        $this->loadTagger();
        
        $parser = $this->modx->getParser();
        
        if (isset($this->body['content'])) {
            $content = $this->body['content'];
            $content = Utils::htmlDecodeTags($content, $parser);
            
            $object->setContent($content);
        }

        $c = $this->modx->newQuery('modTemplateVar');
        $c->leftJoin('modTemplateVarTemplate', 'TemplateVarTemplates');

        $c->where([
            'type' => 'freddropzone',
            'TemplateVarTemplates.templateid' => $object->get('template')
        ]);

        /** @var \modTemplateVar[] $tvs */
        $tvs = $this->modx->getIterator('modTemplateVar', $c);
        foreach ($tvs as $tv) {
            $tvName = $tv->get('name');
            
            if (isset($this->body[$tvName])) {
                $tvContent = $this->body[$tvName];
                $tvContent = Utils::htmlDecodeTags($tvContent, $parser);

                $object->setTVValue($tvName, $tvContent);
            }
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
        
        if (isset($this->body['pageSettings']['deleted'])) {
            $currentValue = (boolean)$object->get('deleted');
            $incomingValue = (boolean)$this->body['pageSettings']['deleted'];

            if ($incomingValue) {
                if (!$this->modx->hasPermission('delete_document') || !$object->checkPolicy('delete')) {
                    $incomingValue = $currentValue;
                }
            } else {
                if (!$this->modx->hasPermission('undelete_document') || !$object->checkPolicy('undelete')) {
                    $incomingValue = $currentValue;
                }
            }
            
            if ($incomingValue !== $currentValue) {
                $object->set('deleted', $incomingValue);
                $object->set('deletedon', $incomingValue ? time() : false);
                $object->set('deletedby', $incomingValue ? $this->modx->user->get('id') : 0);
            }
        }
        
        if (isset($this->body['pageSettings']['publishon'])) {
            $currentValue = (int)$object->get('pub_date');
            $incomingValue = (int)$this->body['pageSettings']['publishon'];
            
            if (!$this->modx->hasPermission('publish_document') || !$object->checkPolicy('publish')) {
                $incomingValue = $currentValue;
            }
            
            $object->set('pub_date', $incomingValue);
        }
        
        if (isset($this->body['pageSettings']['unpublishon'])) {
            $currentValue = (int)$object->get('unpub_date');
            $incomingValue = (int)$this->body['pageSettings']['unpublishon'];
            
            if (!$this->modx->hasPermission('unpublish_document') || !$object->checkPolicy('unpublish')) {
                $incomingValue = $currentValue;
            }
            $object->set('unpub_date', $incomingValue);
        }

        $uriChanged = false;
        if (isset($this->body['pageSettings']['alias'])) {
            $object->set('alias', $this->body['pageSettings']['alias']);
            $uriChanged = $object->isDirty('alias');
        }

        if (isset($this->body['pageSettings']['published'])) {
            $currentValue = (boolean)$object->get('published');
            $incomingValue = (boolean)$this->body['pageSettings']['published'];
            
            if ($incomingValue) {
                if (!$this->modx->hasPermission('publish_document') || !$object->checkPolicy('publish')) {
                    $incomingValue = $currentValue;
                }
            } else {
                if (!$this->modx->hasPermission('unpublish_document') || !$object->checkPolicy('unpublish')) {
                    $incomingValue = $currentValue;
                }
            }

            if ($incomingValue !== $currentValue) {
                $object->set('published', (boolean)$this->body['pageSettings']['published']);
                $object->set('publishedon', $incomingValue ? time() : false);
                $object->set('publishedby', $incomingValue ? $this->modx->user->get('id') : 0);
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

        $this->body['data']['fingerprint'] = Utils::resourceFingerprint($object);
        $object->setProperty('data', $this->body['data'], 'fred');
        
        $saved = $object->save();

        if (!$saved) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_save'));
        }
        
        if (isset($this->body['pageSettings']['tvs']) && is_array($this->body['pageSettings']['tvs'])) {
            foreach ($this->body['pageSettings']['tvs'] as $tvName => $tvValue) {
                $object->setTVValue($tvName, $tvValue);
            }
        }

        $this->modx->getCacheManager()->refresh();

        $response = [
            'message' => $this->modx->lexicon('fred.fe.pages.updated'),
            'fingerprint' => $this->body['data']['fingerprint']
            
        ];
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
