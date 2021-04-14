<?php
use MODX\Revolution\modX;
use xPDO\Transport\xPDOTransport;

/**
 * @var xPDOTransport $transport
 * @var array $object
 * @var array $options
 */

/** @var modX $modx */
$modx =& $transport->xpdo;

switch($options[xPDOTransport::PACKAGE_ACTION]) {
    case xPDOTransport::ACTION_INSTALL:
    case xPDOTransport::ACTION_UPGRADE:
        $success = true;

        // bcmath check
        if (!extension_loaded('bcmath')) {
            $modx->log(modX::LOG_LEVEL_ERROR, 'PHP extension "bcmath" is not loaded, but it is required by Fred.');
            $success = false;
        }

        if (!$success) {
            $modx->log(modX::LOG_LEVEL_ERROR, 'Requirements not met. Fred can\'t be installed.');
        }

        return $success;    
}

return true;
