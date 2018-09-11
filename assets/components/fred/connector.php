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
require_once dirname(dirname(dirname(dirname(__FILE__)))) . '/config.core.php';
require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
require_once MODX_CONNECTORS_PATH . 'index.php';

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

$modx->request->handleRequest(
    array(
        'processors_path' => $fred->getOption('processorsPath', [], $corePath . 'processors/'),
        'location' => '',
    )
);