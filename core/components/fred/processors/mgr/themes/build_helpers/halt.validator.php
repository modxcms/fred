<?php
/**
 * @var xPDOTransport $transport
 */

if ($options[xPDOTransport::PACKAGE_ACTION] === xPDOTransport::ACTION_UNINSTALL) {
    $uninstallApproved = $transport->getAttribute('uninstall_allowed');
    
    if (empty($uninstallApproved)) {
        return false;
    }
}


return true;