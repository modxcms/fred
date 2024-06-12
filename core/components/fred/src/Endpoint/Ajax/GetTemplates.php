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

use Fred\Model\FredThemedTemplate;
use MODX\Revolution\modTemplate;

class GetTemplates extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\GetTemplates;

    protected $allowedMethod = ['OPTIONS', 'GET'];
    protected $templates = [];
    protected $map = [];
    protected $resources = [];
    private $themedTemplateClass = FredThemedTemplate::class;
    private $templateClass = modTemplate::class;
}
