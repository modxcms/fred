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

class RenderElement extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\RenderElement;

    protected $allowedMethod = ['POST', 'OPTIONS'];
    private $elementClass = 'FredElement';
    private $requestClass = 'modRequest';
    private $resourceClass = 'modResource';

    public function __construct(\Fred &$fred, $payload)
    {
        parent::__construct($fred, $payload);
        $this->modx->loadClass($this->requestClass, '', false, true);
    }

}
