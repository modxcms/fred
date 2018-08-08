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

class RenderElement extends Endpoint
{
    protected $allowedMethod = ['POST', 'OPTIONS'];
    
    function process()
    {
        $resourceId = isset($this->body['resource']) ? intval($this->body['resource']) : 0;
        $elementUUID = isset($this->body['element']) ? $this->body['element'] : '';
        $parseModx = empty($this->body['parseModx']) ? false : true;
        $settings = empty($this->body['settings']) ? [] : $this->body['settings'];
        
        if (empty($resourceId)) {
            return $this->failure('No resource was provided');
        }

        if (empty($elementUUID)) {
            return $this->failure('No element was provided');
        }
        
        /** @var \FredElement $element */
        $element = $this->modx->getObject('FredElement', ['uuid' => $elementUUID]);
        $templateName = $element->name . '_' . $element->id;
        
        $twig = new \Twig_Environment(new \Twig_Loader_Array([
            $templateName => $element->content
        ]));
        $twig->setCache(false);
        
        try {
            $html = $twig->render($templateName, $settings);
        } catch (\Exception $e) {
            return $this->failure($e->getMessage());
        }

        if ($parseModx === true) {
            $this->modx->getParser();
            $maxIterations = empty($maxIterations) || (integer) $maxIterations < 1 ? 10 : (integer) $maxIterations;
            $currentResource = $this->modx->resource;
            $currentResourceIdentifier = $this->modx->resourceIdentifier;
            $currentElementCache = $this->modx->elementCache;
    
            $resource = $this->modx->getObject('modResource', $resourceId);
            
            $this->modx->resource = $resource;
            $this->modx->resourceIdentifier = $resource->get('id');
            $this->modx->elementCache = array();
            
            $this->modx->parser->processElementTags('', $html, false, false, '[[', ']]', array(), $maxIterations);
            $this->modx->parser->processElementTags('', $html, true, false, '[[', ']]', array(), $maxIterations);
            $this->modx->parser->processElementTags('', $html, true, true, '[[', ']]', array(), $maxIterations);
    
            $this->modx->elementCache = $currentElementCache;
            $this->modx->resourceIdentifier = $currentResourceIdentifier;
            $this->modx->resource = $currentResource;
        }
        
        return $this->data([
            "html" => $html
        ]);
    }
    

}
