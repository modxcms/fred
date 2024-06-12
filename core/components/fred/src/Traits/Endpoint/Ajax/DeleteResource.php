<?php

/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fred\Traits\Endpoint\Ajax;

trait DeleteResource
{
    public function process()
    {
        if (!isset($this->body['resource'])) {
            return $this->failure('No id was provided');
        }

        $resourceId = intval($this->body['resource']);

        if (empty($resourceId)) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_ns_id'));
        }

        /** @var $resource */
        $resource = $this->modx->getObject($this->resourceClass, ['id' => $resourceId]);

        if (!$resource) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_nf'));
        }

        if (!$this->modx->hasPermission('delete_document') || !$resource->checkPolicy(['delete' => true, 'save' => true])) {
            return $this->failure($this->modx->lexicon('fred.fe.err.permission_denied'));
        }

        $this->deletedTime = time();

        $resource->set('deleted', true);
        $resource->set('deletedby', $this->modx->user->get('id'));
        $resource->set('deletedon', $this->deletedTime);
        $resource->save();

        $this->deleteChildren($resource);

        $this->modx->cacheManager->refresh([
            'db' => [],
            'auto_publish' => ['contexts' => [$resource->get('context_key')]],
            'context_settings' => ['contexts' => [$resource->get('context_key')]],
            'resource' => ['contexts' => [$resource->get('context_key')]],
        ]);

        $data = [
            'message' => $this->modx->lexicon('fred.fe.pages.deleted')
        ];

        return $this->success($data);
    }

    /**
     * @param $resource
     * @return mixed
     */
    public function deleteChildren($resource)
    {
        /** @var $childResources */
        $childResources = $this->modx->getIterator($this->resourceClass, [
            'parent' => $resource->id
        ]);

        foreach ($childResources as $child) {
            if ($child->get('id') == $this->modx->getOption('site_start')) {
                continue;
            }
            if ($child->get('id') == $this->modx->getOption('site_unavailable_page')) {
                continue;
            }

            $child->set('deleted', true);
            $child->set('deletedby', $this->modx->user->id);
            $child->set('deletedon', $this->deletedTime);
            $child->save();

            $this->deleteChildren($child);
        }

        return true;
    }
}
