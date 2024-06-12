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

use Fred\Model\FredBlueprint;
use Fred\RenderResource;
use MODX\Revolution\modContextSetting;
use MODX\Revolution\modResource;

class CreateResource extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\CreateResource;

    private $resourceClass = modResource::class;
    private $blueprintClass = FredBlueprint::class;
    private $contextSettingClass = modContextSetting::class;
    private $renderResource = RenderResource::class;

}
