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
use MODX\Revolution\modContextSetting;
use MODX\Revolution\modResource;

class GetResourceTree extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\GetResourceTree;

    protected $allowedMethod = ['OPTIONS', 'GET'];
    protected $templates = [];
    protected $map = [];
    protected $resources = [];
    protected $sessionEnabled = [];

    protected $hideChildren = [];

    private $resourceClass = modResource::class;
    private $contextSettingClass = modContextSetting::class;
    private $themedTemplateClass = FredThemedTemplate::class;
}
