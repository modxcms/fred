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

class DuplicateResource extends Endpoint
{
    public function process()
    {
        $resourceId = (int)$this->modx->getOption('resource', $this->body, 0);
        $pageTitle = $this->modx->getOption('pagetitle', $this->body, '');
        $duplicateChildren = $this->modx->getOption('duplicate_children', $this->body, false);
        $publishingOptions = $this->modx->getOption('publishing_options', $this->body, 'preserve');

        if (empty($resourceId)) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_ns_id'));
        }

        if (empty($pageTitle)) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_ns_pagetitle'));
        }

        /** @var modResource $resource */
        $resource = $this->modx->getObject(modResource::class, ['id' => $resourceId]);

        if (!$resource) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_nf'));
        }

        if (!$this->modx->hasPermission('resource_duplicate') || !$resource->checkPolicy('copy')) {
            return $this->failure($this->modx->lexicon('fred.fe.err.permission_denied'));
        }

        $newResource = $resource->duplicate(array(
            'newName' => $pageTitle,
            'duplicateChildren' => $duplicateChildren,
            'prefixDuplicate' => false,
            'publishedMode' => $publishingOptions,
        ));

        if (!($newResource instanceof modResource)) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_duplicate_failed'));
        }

        $this->modx->invokeEvent('OnResourceDuplicate', [
            'oldResource' => $resource,
            'newResource' => $newResource,
            'newName' => $pageTitle,
            'duplicateChildren' => $duplicateChildren,
            'prefixDuplicate' => false,
            'publishedMode' => $publishingOptions,
        ]);

        $this->modx->cacheManager->refresh([
            'db' => [],
            'auto_publish' => ['contexts' => [$newResource->get('context_key')]],
            'context_settings' => ['contexts' => [$newResource->get('context_key')]],
            'resource' => ['contexts' => [$newResource->get('context_key')]],
        ]);

        $data = [
            'message' => $this->modx->lexicon('fred.fe.pages.duplicated'),
            'id' => $newResource->id,
            'url' => $this->modx->makeUrl($newResource->id, $newResource->context_key, '', 'full')
        ];

        return $this->success($data);
    }
}
