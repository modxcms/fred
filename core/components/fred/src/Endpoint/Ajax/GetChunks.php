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

use Fred\Utils;
use MODX\Revolution\modCategory;
use MODX\Revolution\modChunk;

class GetChunks extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\GetChunks;

    protected $allowedMethod = ['OPTIONS', 'GET'];
    protected $chunks = [];
    private $chunkClass = modChunk::class;
    private $categoryClass = modCategory::class;
}
