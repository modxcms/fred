<?php

/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Fred Connector
 *
 * @package fred
 */

require_once dirname(__FILE__, 4) . '/config.core.php';
require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
require_once MODX_CONNECTORS_PATH . 'index.php';

$corePath = $modx->getOption('fred.core_path', null, $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');
/** @var Fred $fred */
$fred = $modx->getService(
    'fred',
    'Fred',
    $corePath . 'model/fred/',
    [
        'core_path' => $corePath
    ]
);

$action = $_REQUEST['action'] ?? null;
// replace namespace action with processor e.g. Fred\Processors\ElementCategories\GetList => mgr/element_categories/getlist
if ($action) {
    $action = preg_replace('/([a-z])([A-Z])/', '$1_$2', $action);
    $action = preg_replace('/([A-Z])([A-Z])([a-z])/', '$1_$2$3', $action);
    $action = str_replace('\\', '/', strtolower(str_replace('Fred\\Processors\\', '', $action)));
    $actionArray = explode('/', $action);
    $last = array_pop($actionArray);
    $actionArray[] = str_replace('_', '', $last);
    $action = implode('/', $actionArray);
    $action = 'mgr/' . $action;
}

$modx->request->handleRequest(
    [
        'processors_path' => $fred->getOption('processorsPath', [], $corePath . 'processors/'),
        'location' => '',
        'action' => $action
    ]
);
