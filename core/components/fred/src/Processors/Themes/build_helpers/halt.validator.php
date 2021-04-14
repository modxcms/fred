<?php
/**
 * @var xPDOTransport $transport
 */

use xPDO\Transport\xPDOTransport;

if ($options[xPDOTransport::PACKAGE_ACTION] === xPDOTransport::ACTION_UNINSTALL) {
    $uninstallApproved = $transport->getAttribute('uninstall_allowed');

    if (empty($uninstallApproved)) {
        return false;
    }
} else {
    $installApproved = $transport->getAttribute('install_allowed');

    if (empty($installApproved)) {
        return false;
    }
}


return true;
