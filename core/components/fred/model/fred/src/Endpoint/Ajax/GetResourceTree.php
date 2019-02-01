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


class GetResourceTree extends Endpoint
{
    protected $allowedMethod = ['OPTIONS', 'GET'];
    protected $templates = [];
    protected $map = [];
    protected $resources = [];
    protected $sessionEnabled = [];

    /**
     * @return string
     */
    function process()
    {
        $this->identifyTemplates();

        if (empty($this->templates)) {
            return $this->data(['resources' => []]);
        }

        $context = 'web';
        if (isset($_REQUEST['context'])) {
            $context = trim($_REQUEST['context']);
        }

        $resources = $this->modx->getIterator('modResource', [
            'context_key' => $context,
            'template:IN' => $this->templates
        ]);
        /** @var \modResource $resource */
        foreach ($resources as $resource) {
            if (!$resource->checkPolicy('list')) continue;
            $this->handleResource($resource, true);
        }

        $this->resources = $this->sortResources($this->resources);

        return $this->data(['resources' => $this->resources]);
    }

    /**
     * @param \modResource $resource
     * @param boolean $isFred
     */
    protected function handleResource($resource, $isFred) {
        $pageFormatted = [
            'id' => $resource->id,
            'pagetitle' => $resource->pagetitle,
            'children' => [],
            'isFred' => $isFred,
            'template' => $resource->template,
            'published' => (boolean)$resource->published,
            'deleted' => (boolean)$resource->deleted,
            'url' => $this->getPreviewUrl($resource),
            'hidemenu' => (boolean)$resource->hidemenu,
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
            if (!isset($this->map[$resource->id])) {
                $this->map[$resource->id] = $pageFormatted;
                $this->map[$resource->parent]['children'][] =& $this->map[$resource->id];
            }
            
            return;
        }

        $parent = $resource->Parent;
        $this->handleResource($parent, in_array($parent->template, $this->templates));

        $this->map[$resource->id] = $pageFormatted;
        $this->map[$resource->parent]['children'][] =& $this->map[$resource->id];
    }

    protected function identifyTemplates()
    {
        $c = $this->modx->newQuery('FredThemedTemplate');
        $c->select($this->modx->getSelectColumns('FredThemedTemplate', 'FredThemedTemplate', '', ['template']));

        $c->prepare();
        $c->stmt->execute();

        $templateIds = $c->stmt->fetchAll(\PDO::FETCH_COLUMN, 0);
        $templateIds = array_map('intval', $templateIds);
        $this->templates = array_filter($templateIds);
    }

    /**
     * @param \modResource $resource
     * @return string
     */
    public function getPreviewUrl($resource) {
        $previewUrl = ''; 
            
        if (!$resource->get('deleted')) {
            $this->modx->setOption('cache_alias_map', false);
            $sessionEnabled = '';
            
            if (isset($this->sessionEnabled[$resource->get('context_key')])) {
                $sessionEnabled = $this->sessionEnabled[$resource->get('context_key')];    
            } else {
                $ctxSetting = $this->modx->getObject('modContextSetting', array('context_key' => $resource->get('context_key'), 'key' => 'session_enabled'));

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
