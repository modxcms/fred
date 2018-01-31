<?php

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
$modx= new modX();
if (!is_object($modx) || !($modx instanceof modX)) {
    ob_get_level() && @ob_end_flush();
    exit();
}

$modx->startTime= $tStart;

$modx->initialize('web');

$corePath = $modx->getOption('fred.core_path', null, $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');
/** @var Fred $fred */
$fred = $modx->getService(
    'fred',
    'Fred',
    $corePath . 'model/fred/',
    array(
        'core_path' => $corePath
    )
);