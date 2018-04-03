<?php

namespace Fred\Endpoint\Ajax;


class CreateResource extends Endpoint
{
    function process()
    {
        if (!isset($this->body['parent'])) {
            return $this->failure('No id was provided');
        }

        if (!isset($this->body['template'])) {
            return $this->failure('No template was provided');
        }
        
        if (empty($this->body['pagetitle'])) {
            return $this->failure('No pagetitle was provided');
        }

        $context = 'web';
        
        $c = $this->modx->newQuery('modResource');
        $c->where([
            'context_key' => $context,
            'parent' => $this->body['parent']
        ]);
        $c->sortby('menuindex', 'DESC');
        $c->limit(1);
        $lastResource = $this->modx->getObject('modResource', $c);
        $menuindex = $lastResource ? ($lastResource->menuindex + 1) : 0; 

        /** @var \modResource $object */
        $object = $this->modx->newObject('modResource', [
            'context_key' => $context,
            'parent' => $this->body['parent'],
            'template' => $this->body['template'],
            'pagetitle' => $this->body['pagetitle'],
            'menuindex' => $menuindex,
        ]);
        

        $saved = $object->save();

        if (!$saved) {
            return $this->failure('Error creating new resource');
        }

        $this->modx->getCacheManager()->refresh();

        $response = [
            'message' => 'Resource created',
            'url' => $this->modx->makeUrl($object->get('id'), $object->get('context_key'), '', 'full')
        ];

        return $this->success($response);
    }
}
