<?php

/**
 * @var xPDOTransport $transport
 */

use MODX\Revolution\modX;
use xPDO\Transport\xPDOTransport;
use xPDO\xPDO;

$halt = false;
if ($options[xPDOTransport::PACKAGE_ACTION] !== xPDOTransport::ACTION_UNINSTALL) {
    $modx =& $transport->xpdo;

    $packages = !empty($fileMeta['packages']) ? $fileMeta['packages'] : [];

    foreach ($packages as $package) {
        $componentName = empty($package['componentName']) ? $package['name'] : $package['componentName'];
        $modelName = empty($package['modelName']) ? $package['name'] : $package['modelName'];
        $settingPrefix = empty($package['settingPrefix']) ? $package['name'] : $package['settingPrefix'];

        $service = $modx->getService($package['name'], $package['class'], $modx->getOption($settingPrefix . '.core_path', null, $modx->getOption('core_path') . 'components/' . $componentName . '/') . 'model/' . $modelName . '/', []);
        if (!($service instanceof $package['class'])) {
            $halt = true;
            $modx->log(modX::LOG_LEVEL_ERROR, ' - Could not load ' . $package['name'] . ' service.');
            break;
        }
    }

    $modx->log(xPDO::LOG_LEVEL_INFO, '<br>');

    if ($halt === true) {
        $modx->log(xPDO::LOG_LEVEL_ERROR, 'Install not allowed.');
    } else {
        $modx->log(xPDO::LOG_LEVEL_INFO, 'Install allowed.');
    }

    $modx->log(xPDO::LOG_LEVEL_INFO, '<hr>');
}

if ($halt === false) {
    $transport->setAttribute('install_allowed', 'OK');
    return true;
}

return false;
