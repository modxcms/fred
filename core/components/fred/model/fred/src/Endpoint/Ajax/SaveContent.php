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

        $object->setProperty('data', $this->body['data'], 'fred');
        $saved = $object->save();

        if (!$saved) {
            return $this->failure('Error saving fred properties to resource with id ' . $object->get('id'));
        }

        return $this->success('Save successful');
    }
}
