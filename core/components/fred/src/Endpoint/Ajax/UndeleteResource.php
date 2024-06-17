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

use MODX\Revolution\modResource;

class UndeleteResource extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\UndeleteResource;

    private $resourceClass = modResource::class;
}
