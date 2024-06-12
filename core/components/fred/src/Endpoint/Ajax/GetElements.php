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
use Fred\Model\FredElementCategory;
use Fred\Model\FredElementCategoryTemplateAccess;
use Fred\Model\FredElementTemplateAccess;

class GetElements extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\GetElements;

    protected $allowedMethod = ['OPTIONS', 'GET'];
    private $elementClass = FredElement::class;
    private $elementCategoryClass = FredElementCategory::class;
    private $elementCategoryTemplateAccessClass = FredElementCategoryTemplateAccess::class;
    private $elementTemplateAccessClass = FredElementTemplateAccess::class;
}
