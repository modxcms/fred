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

trait RenderElement
{
    public function process()
    {
        $resourceId = isset($this->body['resource']) ? intval($this->body['resource']) : 0;
        $elementUUID = isset($this->body['element']) ? $this->body['element'] : '';
        $parseModx = empty($this->body['parseModx']) ? false : true;
        $cacheOutput = empty($this->body['cacheOutput']) ? false : true;
        $refreshCache = empty($this->body['refreshCache']) ? false : true;
        $settings = empty($this->body['settings']) ? [] : $this->body['settings'];

        if (empty($resourceId)) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_ns_id'));
        }

        if (empty($elementUUID)) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_ns_element'));
        }

        /** @var $element */
        $element = $this->modx->getObject($this->elementClass, ['uuid' => $elementUUID]);
        $category = $element->getOne('Category');
        $theme = $this->modx->getObject($this->themeClass, $category->theme);

        if (!$this->modx->hasPermission('fred_element_cache_refresh')) {
            $refreshCache = false;
        }

        if (($cacheOutput === true) && ($refreshCache === false)) {
            $cache = $element->getCache($resourceId);

            if ($cache !== false) {
                return $this->data(["html" => $cache]);
            }
        }

        $templateName = $element->name . '_' . $element->id;

        $loader = new \Twig\Loader\ArrayLoader([
            $templateName => $element->content
        ]);
        $twig = new \Twig\Environment($loader, []);
        $twig->setCache(false);

        $settings['theme_dir'] = $theme->getThemeFolderUri();
        $settings['theme_setting'] = $this->getThemeSettings($theme);
        $settings['template'] = [
            'theme_dir' => $theme->getThemeFolderUri()
        ];
        $resource = $this->modx->getObject($this->resourceClass, $resourceId);
        if (empty($resource)) {
            return $this->failure($this->modx->lexicon('fred.fe.err.resource_ns_id'));
        }
        foreach ($resource->toArray() as $key => $value) {
            if (isset($settings[$key])) {
                continue;
            }
            $settings[$key] = $value;
        }
        unset($settings['content']);
        if (!isset($settings['tvs'])) {
            $tvs = $resource->getTemplateVars();
            foreach ($tvs as $tv) {
                if (isset($settings['tv_' . $tv->get('name')])) {
                    continue;
                }
                $settings['tv_' . $tv->get('name')] = $resource->getTVValue($tv->get('name'));
            }
        } else {
            foreach ($settings['tvs'] as $tv) {
                if (isset($settings['tv_' . $tv['name']])) {
                    continue;
                }
                $settings['tv_' . $tv['name']] = $tv['value'];
            }
        }

        try {
            $html = $twig->render($templateName, $settings);
        } catch (\Exception $e) {
            return $this->failure($e->getMessage());
        }

        if ($parseModx === true) {
            $queryParams = $this->getClaim('queryParams');
            if ($queryParams !== false) {
                $queryParams = (array)$queryParams;
                $_GET = $queryParams;
            }

            $postParams = $this->getClaim('postParams');
            if ($postParams !== false) {
                $postParams = (array)$postParams;
                $_POST = $postParams;
            }

            $requestParams = $this->getClaim('requestParams');
            if ($requestParams !== false) {
                $requestParams = (array)$requestParams;
                $_REQUEST = $requestParams;
            }

            $cookie = $this->getClaim('cookie');
            if ($cookie !== false) {
                $cookie = (array)$cookie;
                $_COOKIE = $cookie;
            }

            $this->modx->request = new $this->requestClass($this->modx);
            $this->modx->request->sanitizeRequest();

            $this->modx->getParser();
            $maxIterations = empty($maxIterations) || (int) $maxIterations < 1 ? 10 : (int) $maxIterations;
            $currentResource = $this->modx->resource;
            $currentResourceIdentifier = $this->modx->resourceIdentifier;
            $currentElementCache = $this->modx->elementCache;

            $this->modx->resource = $resource;
            $this->modx->resourceIdentifier = $resource->get('id');
            $this->modx->elementCache = [];

            $this->modx->parser->processElementTags('', $html, false, false, '[[', ']]', [], $maxIterations);
            $this->modx->parser->processElementTags('', $html, true, false, '[[', ']]', [], $maxIterations);
            $this->modx->parser->processElementTags('', $html, true, true, '[[', ']]', [], $maxIterations);

            $this->modx->elementCache = $currentElementCache;
            $this->modx->resourceIdentifier = $currentResourceIdentifier;
            $this->modx->resource = $currentResource;

            if ($cacheOutput === true) {
                $element->setCache($resourceId, $html);
            }
        }

        return $this->data([
            "html" => $html
        ]);
    }

    private function getThemeSettings($theme)
    {
        $settings = [];
        if ($theme) {
            $keys = $theme->getSettingKeys();
            foreach ($keys as $key) {
                $settings[$key] = $this->modx->getOption($theme->get('settingsPrefix') . '.setting.' . $key, [], '');
            }
        }

        return $settings;
    }
}
