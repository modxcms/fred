<?php

namespace Fred\Endpoint\Ajax;


class SaveContent extends Endpoint
{
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

        if (isset($this->body['content'])) {
            $object->setContent($this->body['content']);
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
}
