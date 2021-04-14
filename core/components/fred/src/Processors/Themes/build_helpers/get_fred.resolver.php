<?php

use MODX\Revolution\modX;
use xPDO\Transport\xPDOTransport;

if ($options[xPDOTransport::PACKAGE_ACTION] !== xPDOTransport::ACTION_UNINSTALL) {
    /** @var modX $modx */
    $modx =& $transport->xpdo;
    $fred = $modx->services->get('fred');
}
