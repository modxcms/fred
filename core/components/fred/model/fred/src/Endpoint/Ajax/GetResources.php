<?php

namespace Fred\Endpoint\Ajax;


class GetResources extends Endpoint
{
    protected $allowedMethod = ['OPTIONS', 'GET'];
    protected $templates = [];
    protected $map = [];
    protected $resources = [];

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
        foreach ($resources as $resource) {
            $this->handleResource($resource, true);
        }

        $this->resources = $this->sortResources($this->resources);

        return $this->data(['resources' => $this->resources]);
    }

    protected function handleResource($resource, $isFred) {
        $pageFormatted = [
            'pagetitle' => $resource->pagetitle,
            'children' => [],
            'isFred' => $isFred,
            'published' => (boolean)$resource->published,
            'deleted' => (boolean)$resource->deleted,
            'url' => $this->modx->makeUrl($resource->id, $resource->context_key, '', 'full'),
            'menuindex' => $resource->menuindex
        ];

        if ($resource->parent === 0) {
            $this->map[$resource->id] = $pageFormatted;
            $this->resources[] =& $this->map[$resource->id];

            return;
        }

        if (isset($this->map[$resource->parent])) {
            $this->map[$resource->id] = $pageFormatted;
            $this->map[$resource->parent]['children'][] =& $this->map[$resource->id];
            return;
        }

        $parent = $resource->Parent;
        $this->handleResource($parent, in_array($parent->template, $this->templates));

        $this->map[$resource->id] = $pageFormatted;
        $this->map[$resource->parent]['children'][] =& $this->map[$resource->id];
    }

    protected function identifyTemplates()
    {
        $templateIds = explode(',', $this->fred->getOption('template_ids'));
        $templateIds = array_map('trim', $templateIds);
        $templateIds = array_map('intval', $templateIds);
        $this->templates = array_filter($templateIds);
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
