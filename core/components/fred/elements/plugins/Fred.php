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
 * @package fred
 * @var modX $modx
 * @var array $scriptProperties
 */

if (!$modx->version) {
    $modx->getVersionData();
}
$version = (int) $modx->version['version'];

if ($version > 2) {
    $fred = $modx->services->get('fred');
} else {
    $corePath = $modx->getOption('fred.core_path', null, $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');
    $fred = $modx->getService(
        'fred',
        'Fred',
        $corePath . 'model/fred/',
        [
            'core_path' => $corePath
        ]
    );
}

$class = '\\Fred\\';
if ($version < 3) {
    $class .= 'v2\\';
}
$class .= 'Elements\\Event\\' . $modx->event->name;

if (class_exists($class)) {
    /** @var \Fred\Elements\Event\Event $event */
    $event = new $class($fred, $scriptProperties);
    $event->run();
} else {
    $modx->log(\xPDO::LOG_LEVEL_ERROR, "Class {$class} not found");
}
