<?php

use MODX\Revolution\modX;
use xPDO\Transport\xPDOTransport;

/**
 * @var xPDOTransport $transport
 * @var array $object
 * @var array $options
 */


if ($object->xpdo) {
    /** @var modX $modx */
    $modx =& $transport->xpdo;

    $events = [
        'FredBeforeRender',
        'FredElementFormRender',
        'FredOnBeforeFredResourceSave',
        'FredOnFredResourceSave',
        'FredOnFredResourceLoad',
        'FredOnBeforeGetResourceTree',
        'FredOnElfinderRoots'
    ];

    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_INSTALL:
        case xPDOTransport::ACTION_UPGRADE:
            foreach ($events as $eventName) {
                $event = $modx->getObject('modEvent', ['name' => $eventName]);
                if (!$event) {
                    $event = $modx->newObject('modEvent');
                    $event->set('name', $eventName);
                    $event->set('service', 6);
                    $event->set('groupname', 'Fred');
                    $event->save();
                }
            }

            break;
        case xPDOTransport::ACTION_UNINSTALL:
            foreach ($events as $eventName) {
                $event = $modx->getObject('modEvent', ['name' => $eventName]);
                if ($event) {
                    $event->remove();
                }
            }

            break;
    }
}
return true;
