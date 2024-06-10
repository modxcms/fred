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

use MODX\Revolution\modResource;

class UndeleteResource extends Endpoint
{
    public function process()
    {
        if (!isset($this->body['resource'])) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_ns_id'));
        }

        $resourceId = intval($this->body['resource']);

        if (empty($resourceId)) {
            return $this->failure('No id was provided');
        }

        /** @var modResource $resource */
        $resource = $this->modx->getObject(modResource::class, ['id' => $resourceId]);

        if (!$resource) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_nf_id', ['id' => $resourceId]));
        }

        if (!$this->modx->hasPermission('undelete_document') || !$resource->checkPolicy(['undelete' => true, 'save' => true])) {
            return $this->failure($this->modx->lexicon('fred.fe.err.permission_denied'));
        }

        $resource->set('deleted', false);
        $resource->set('deletedby', 0);
        $resource->set('deletedon', 0);
        $resource->save();

        $this->undeleteChildren($resource);

        $this->modx->cacheManager->refresh([
            'db' => [],
            'auto_publish' => ['contexts' => [$resource->get('context_key')]],
            'context_settings' => ['contexts' => [$resource->get('context_key')]],
            'resource' => ['contexts' => [$resource->get('context_key')]],
        ]);

        $data = [
            'message' => $this->modx->lexicon('fred.fe.pages.undeleted')
        ];

        return $this->success($data);
    }

    /**
     * @param modResource $resource
     * @return mixed
     */
    public function undeleteChildren($resource)
    {
        /** @var modResource[] $childResources */
        $childResources = $this->modx->getIterator(modResource::class, [
            'parent' => $resource->id,
            'deleted' => true,
        ]);

        foreach ($childResources as $child) {
            $child->set('deleted', false);
            $child->set('deletedby', 0);
            $child->set('deletedon', 0);
            $child->save();

            $this->undeleteChildren($child);
        }

        return true;
    }
}
