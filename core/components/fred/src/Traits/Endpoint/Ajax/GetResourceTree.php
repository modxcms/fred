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

trait GetResourceTree
{
    /**
     * @return string
     */
    public function process()
    {
        $this->identifyTemplates();

        if (empty($this->templates)) {
            return $this->data(['resources' => []]);
        }

        $context = 'web';
        if (isset($_REQUEST['context'])) {
            $context = trim($_REQUEST['context']);
        }

        $params = new \stdClass();
        $params->hideChildren =& $this->hideChildren;

        $this->modx->invokeEvent('FredOnBeforeGetResourceTree', [
            'params' => &$params
        ]);

        $this->hideChildren = array_flip($this->hideChildren);
        if (isset($this->hideChildren[0])) {
            unset($this->hideChildren[0]);
        }

        $c = [
            'context_key' => $context,
            'template:IN' => $this->templates
        ];

        if (!empty($this->hideChildren)) {
            $c['parent:NOT IN'] = array_keys($this->hideChildren);
        }

        /** @var $resources */
        $resources = $this->modx->getIterator($this->resourceClass, $c);

        foreach ($resources as $resource) {
            if (!$resource->checkPolicy('list')) {
                continue;
            }
            if (isset($this->hideChildren[$resource->parent])) {
                $this->hideChildren[$resource->id] = true;
                continue;
            }

            $this->handleResource($resource, true);
        }

        $this->resources = $this->sortResources($this->resources);

        return $this->data(['resources' => $this->resources]);
    }

    /**
     * @param $resource
     * @param boolean $isFred
     */
    protected function handleResource($resource, $isFred)
    {
        $pageFormatted = [
            'id' => $resource->id,
            'pagetitle' => $resource->pagetitle,
            'children' => [],
            'isFred' => $isFred,
            'template' => $resource->template,
            'published' => (bool)$resource->published,
            'deleted' => (bool)$resource->deleted,
            'url' => $this->getPreviewUrl($resource),
            'hidemenu' => (bool)$resource->hidemenu,
            'menuindex' => $resource->menuindex
        ];

        if ($resource->parent === 0) {
            if (!isset($this->map[$resource->id])) {
                $this->map[$resource->id] = $pageFormatted;
                $this->resources[] =& $this->map[$resource->id];
            }

            return;
        }

        if (isset($this->map[$resource->parent])) {
            if (isset($this->hideChildren[$resource->parent])) {
                $this->hideChildren[$resource->id] = true;
                return;
            }

            if (!isset($this->map[$resource->id])) {
                $this->map[$resource->id] = $pageFormatted;
                $this->map[$resource->parent]['children'][] =& $this->map[$resource->id];
            }

            return;
        }

        $parent = $resource->Parent;
        $this->handleResource($parent, in_array($parent->template, $this->templates));
        if (isset($this->hideChildren[$resource->parent])) {
            $this->hideChildren[$resource->id] = true;
            return;
        }

        $this->map[$resource->id] = $pageFormatted;
        $this->map[$resource->parent]['children'][] =& $this->map[$resource->id];
    }

    protected function identifyTemplates()
    {
        $c = $this->modx->newQuery($this->themedTemplateClass);
        $c->select($this->modx->getSelectColumns($this->themedTemplateClass, 'FredThemedTemplate', '', ['template']));

        $c->prepare();
        $c->stmt->execute();

        $templateIds = $c->stmt->fetchAll(\PDO::FETCH_COLUMN, 0);
        $templateIds = array_map('intval', $templateIds);
        $this->templates = array_filter($templateIds);
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

            if (isset($this->sessionEnabled[$resource->get('context_key')])) {
                $sessionEnabled = $this->sessionEnabled[$resource->get('context_key')];
            } else {
                $ctxSetting = $this->modx->getObject($this->contextSettingClass, array('context_key' => $resource->get('context_key'), 'key' => 'session_enabled'));

                if ($ctxSetting) {
                    $sessionEnabled = $ctxSetting->get('value') == 0 ? array('preview' => 'true') : '';
                }

                $this->sessionEnabled[$resource->get('context_key')] = $sessionEnabled;
            }

            $previewUrl = $this->modx->makeUrl($resource->get('id'), $resource->get('context_key'), $sessionEnabled, 'full', array('xhtml_urls' => false));
        }
        return $previewUrl;
    }

    protected function sortResources($resources)
    {
        usort($resources, [$this, 'compareMenuindex']);

        foreach ($resources as &$resource) {
            if (!empty($resource['children'])) {
                $resource['children'] = $this->sortResources($resource['children']);
            }
        }

        return $resources;
    }

    protected function compareMenuindex($a, $b)
    {
        if ($a['menuindex'] === $b['menuindex']) {
            return 0;
        }

        return $a['menuindex'] > $b['menuindex'] ? +1 : -1;
    }
}
