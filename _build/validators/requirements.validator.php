<?php

/** @var modX $modx */
$modx =& $object->xpdo;

$success = false;

switch ($options[xPDOTransport::PACKAGE_ACTION]) {
    case xPDOTransport::ACTION_INSTALL:
    case xPDOTransport::ACTION_UPGRADE:
        $success = true;

        // check if php is greater than 8.1
        if (PHP_VERSION_ID < 80100) {
            $modx->log(xPDO::LOG_LEVEL_ERROR, 'PHP version must be greater than 8.1, but it is ' . PHP_VERSION . '.');
            $success = false;
        }

        // bcmath check
        if (!extension_loaded('bcmath')) {
            $modx->log(xPDO::LOG_LEVEL_ERROR, 'PHP extension "bcmath" is not loaded, but it is required by Fred.');
            $success = false;
        }

        if (!$success) {
            $modx->log(xPDO::LOG_LEVEL_ERROR, 'Requirements not met. Fred can\'t be installed.');
        }

        break;
    case xPDOTransport::ACTION_UNINSTALL:
        $success = true;
        break;
}

return $success;
