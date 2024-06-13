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

use Fred\Utils;

trait CreateResource
{
    public function process()
    {
        if (!$this->modx->hasPermission('new_document')) {
            return $this->failure($this->modx->lexicon('fred.fe.err.permission_denied'));
        }

        if (!isset($this->body['parent'])) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_ns_parent'));
        }

        $parentId = intval($this->body['parent']);

        if (!isset($this->body['template'])) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_ns_template'));
        }

        if (empty($this->body['pagetitle'])) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_ns_pagetitle'), ['pagetitle' => $this->modx->lexicon('fred.fe.err.resource_ns_pagetitle')]);
        }

        if (empty($this->body['contextKey'])) {
            $context = 'web';
        } else {
            $context = $this->body['contextKey'];
        }

        if (!empty($parentId)) {
            $parent = $this->modx->getObject($this->resourceClass, ['id' => intval($parentId)]);
            if ($parent) {
                $context = $parent->context_key;
            }
        }

        $blueprint = isset($this->body['blueprint']) ? intval($this->body['blueprint']) : 0;

        $c = $this->modx->newQuery($this->resourceClass);
        $c->where([
            'context_key' => $context,
            'parent' => $parentId,
        ]);
        $c->sortby('menuindex', 'DESC');
        $c->limit(1);

        $lastResource = $this->modx->getObject($this->resourceClass, $c);
        $menuindex = $lastResource ? ($lastResource->menuindex + 1) : 0;

        $props = [
            'context_key' => $context,
            'parent' => $parentId,
            'template' => $this->body['template'],
            'pagetitle' => $this->body['pagetitle'],
            'richtext' => 0,
            'menuindex' => $menuindex,
        ];

        if (isset($this->body['published']) && ($this->body['published'] !== null)) {
            $props['published'] = $this->body['published'];
        }

        if (isset($this->body['hidemenu']) && ($this->body['hidemenu'] !== null)) {
            $props['hidemenu'] = $this->body['hidemenu'];
        }

        /** @var \MODX\Revolution\Processors\ProcessorResponse $response */
        $response = $this->modx->runProcessor('resource/create', $props);

        if ($response->isError()) {
            $fields = [];
            /** @var \MODX\Revolution\Processors\ProcessorResponseError $error */
            foreach ($response->errors as $error) {
                if (!empty($error->field) && ($error->field === 'alias')) {
                    $fields['pagetitle'] = $this->modx->lexicon('fred.fe.err.resource_ae_pagetitle');
                }
            }
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_save_new'), $fields);
        }

        $object = $response->getObject();

        $resource = $this->modx->getObject($this->resourceClass, $object['id']);

        if (!empty($blueprint)) {
            $blueprintObject = $this->modx->getObject($this->blueprintClass, $blueprint);
            if ($blueprintObject) {
                $data = $blueprintObject->get('data');

                $data['fingerprint'] = Utils::resourceFingerprint($resource);
                $resource->setProperty('data', $data, 'fred');

                $renderer = new $this->renderResource($resource, $this->modx);
                $renderer->render();
            }
        }

        $data = [
            'message' => $this->modx->lexicon('fred.fe.pages.created'),
            'url' => $this->getPreviewUrl($resource),
        ];

        return $this->success($data);
    }

    /**
     * @param $resource
     * @return string
     */
    public function getPreviewUrl($resource)
    {
        $previewUrl = '';

        if (!$resource->get('deleted')) {
            $this->modx->setOption('cache_alias_map', false);
            $sessionEnabled = '';

            $ctxSetting = $this->modx->getObject($this->contextSettingClass, ['context_key' => $resource->get('context_key'), 'key' => 'session_enabled']);

            if ($ctxSetting) {
                $sessionEnabled = $ctxSetting->get('value') == 0 ? ['preview' => 'true'] : '';
            }

            $previewUrl = $this->modx->makeUrl($resource->get('id'), $resource->get('context_key'), $sessionEnabled, 'full', ['xhtml_urls' => false]);
        }
        return $previewUrl;
    }
}
