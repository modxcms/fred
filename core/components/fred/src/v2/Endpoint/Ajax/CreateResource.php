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

use Fred\v2\RenderResource;
use Fred\Utils;

class CreateResource extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\CreateResource;

    private $resourceClass = 'modResource';
    private $blueprintClass = 'FredBlueprint';
    private $contextSettingClass = 'modContextSetting';
    private $renderResource = RenderResource::class;
}
