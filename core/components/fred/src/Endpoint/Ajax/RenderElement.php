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
use Fred\Model\FredTheme;
use MODX\Revolution\modRequest;
use MODX\Revolution\modResource;

class RenderElement extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\RenderElement;

    protected $allowedMethod = ['POST', 'OPTIONS'];
    private $elementClass = FredElement::class;
    private $requestClass = modRequest::class;
    private $resourceClass = modResource::class;
    private $themeClass = FredTheme::class;
}
