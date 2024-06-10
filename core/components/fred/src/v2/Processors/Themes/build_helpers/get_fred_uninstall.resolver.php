<?php

if ($options[xPDOTransport::PACKAGE_ACTION] === xPDOTransport::ACTION_UNINSTALL) {
    $modx =& $transport->xpdo;
    $corePath = $modx->getOption('fred.core_path', null, $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');
    $fred = $modx->getService(
        'fred',
        'Fred',
        $corePath . 'model/fred/',
        array(
            'core_path' => $corePath
        )
    );

    $modx->loadClass('xpdo.transport.xPDOVehicle', $modx->getOption('core_path'), false, true);
    $modx->loadClass('xpdo.transport.xPDOFileVehicle', $modx->getOption('core_path'), false, true);
    $modx->loadClass('fred.FredFileVehicle', $fred->getOption('modelPath'), false, true);
}
