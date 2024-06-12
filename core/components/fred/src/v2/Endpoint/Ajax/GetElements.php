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

class GetElements extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\GetElements;

    protected $allowedMethod = ['OPTIONS', 'GET'];
    private $elementClass = 'FredElement';
    private $elementCategoryClass = 'FredElementCategory';
    private $elementCategoryTemplateAccessClass = 'FredElementCategoryTemplateAccess';
    private $elementTemplateAccessClass = 'FredElementTemplateAccess';
}
