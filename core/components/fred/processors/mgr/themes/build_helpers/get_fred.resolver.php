<?php
if ($options[xPDOTransport::PACKAGE_ACTION] !== xPDOTransport::ACTION_UNINSTALL) {
    $modx =& $transport->xpdo;
    $corePath = $modx->getOption('fred.core_path', null, $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');
    $modx->getService(
        'fred',
        'Fred',
        $corePath . 'model/fred/',
        array(
            'core_path' => $corePath
        )
    );
}