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

use Fred\Model\FredElement;
use MODX\Revolution\modRequest;
use MODX\Revolution\modResource;

class RenderElement extends Endpoint
{
    protected $allowedMethod = ['POST', 'OPTIONS'];

    function process()
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

        /** @var FredElement $element */
        $element = $this->modx->getObject(FredElement::class, ['uuid' => $elementUUID]);

        if (!$this->modx->hasPermission('fred_element_cache_refresh')) {
            $refreshCache = false;
        }

        if (($cacheOutput === true) && ($refreshCache === false)) {
            $cache = $element->getCache($resourceId);

            if ($cache !== false) return $this->data(["html" => $cache]);
        }

        $templateName = $element->name . '_' . $element->id;

        $twig = new \Twig_Environment(new \Twig_Loader_Array([
            $templateName => $element->content
        ]));
        $twig->setCache(false);

        $settings['theme_dir'] = '{{theme_dir}}';
        $settings['template'] = [
            'theme_dir' => '{{template.theme_dir}}'
        ];

        try {
            $html = $twig->render($templateName, $settings);
        } catch (\Exception $e) {
            return $this->failure($e->getMessage());
        }

        if ($parseModx === true) {
            $resource = $this->modx->getObject(modResource::class, $resourceId);

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

            $this->modx->request = new modRequest($this->modx);
            $this->modx->request->sanitizeRequest();

            $this->modx->getParser();
            $maxIterations = empty($maxIterations) || (integer) $maxIterations < 1 ? 10 : (integer) $maxIterations;
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


}
