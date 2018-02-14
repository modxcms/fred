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

        return $this->data(['resources' => $this->resources]);
    }

    protected function handleResource($resource, $isFred) {
        $pageFormatted = [
            'pagetitle' => $resource->pagetitle,
            'children' => [],
            'isFred' => $isFred
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
}
