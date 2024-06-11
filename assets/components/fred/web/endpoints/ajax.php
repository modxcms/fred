<?php

/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

$version = $_REQUEST['modx'] ?? 3;

require_once 'init.'.$version.'x.php';

$class = $version > 2 ? '\\Fred\\Endpoint\\Ajax' : '\\Fred\\v2\\Endpoint\\Ajax';
if (!class_exists($class)) {
    print 'Class not found: ' . $class;
    die();
}
$ajax = new $class($fred);
$ajax->run();
