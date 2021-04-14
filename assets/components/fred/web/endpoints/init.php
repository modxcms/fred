<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

$tStart= microtime(true);

define('MODX_API_MODE', true);
$modx_cache_disabled = false;

require_once dirname(dirname(dirname(dirname(dirname(dirname(__FILE__)))))) . '/config.core.php';
if (!defined('MODX_CORE_PATH')) define('MODX_CORE_PATH', dirname(dirname(dirname(dirname(dirname(dirname(__FILE__)))))) . '/core/');

/* include the modX class */
if (!@include_once (MODX_CORE_PATH . "model/modx/modx.class.php")) {
    exit();
}

/* start output buffering */
ob_start();

/* Create an instance of the modX class */
$modx= new \MODX\Revolution\modX();
if (!is_object($modx) || !($modx instanceof \MODX\Revolution\modX)) {
    ob_get_level() && @ob_end_flush();
    exit();
}

$modx->startTime= $tStart;

$modx->initialize('web');

$corePath = $modx->getOption('fred.core_path', null, $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');
/** @var \Fred\Fred $fred */
$fred = $modx->services->get('fred');
