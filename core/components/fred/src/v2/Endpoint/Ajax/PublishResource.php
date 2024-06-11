<?php

/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fred\v2\Endpoint\Ajax;

class PublishResource extends Endpoint
{
    public function process()
    {
        if (!isset($this->body['resource'])) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_ns_id'));
        }

        $resourceId = intval($this->body['resource']);

        if (empty($resourceId)) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_ns_id'));
        }

        /** @var \modResource $resource */
        $resource = $this->modx->getObject('modResource', ['id' => $resourceId]);

        if (!$resource) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_nf_id', ['id' => $resourceId]));
        }

        if (!$this->modx->hasPermission('publish_document') || !$resource->checkPolicy(['publish' => true, 'save' => true])) {
            return $this->failure($this->modx->lexicon('fred.fe.err.permission_denied'));
        }

        $resource->set('published', true);
        $resource->set('pub_date', false);
        $resource->set('unpub_date', false);
        $resource->set('editedby', $this->modx->user->id);
        $resource->set('editedon', time(), 'integer');
        $resource->set('publishedby', $this->modx->user->id);
        $resource->set('publishedon', time());
        $resource->save();

        $this->modx->cacheManager->refresh([
            'db' => [],
            'auto_publish' => ['contexts' => [$resource->get('context_key')]],
            'context_settings' => ['contexts' => [$resource->get('context_key')]],
            'resource' => ['contexts' => [$resource->get('context_key')]],
        ]);

        $data = [
            'message' => $this->modx->lexicon('fred.fe.pages.published')
        ];

        return $this->success($data);
    }
}
