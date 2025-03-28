<?php

if ($object->xpdo) {
    /** @var modX $modx */
    $modx =& $object->xpdo;

    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_INSTALL:
        case xPDOTransport::ACTION_UPGRADE:
            $setting = $modx->getObject('modSystemSetting', ['key' => 'fred.lit']);
            if (!$setting) {
                $setting = $modx->newObject('modSystemSetting');
                $setting->fromArray([
                    'key' => 'fred.lit',
                    'namespace' => 'fred',
                    'xtype' => 'textfield',
                    'area' => 'fred',
                    'editedon' => time(),
                    'editedby' => 0,
                ]);
            }
            $setting->set('value', time());
            $setting->save();
            break;
    }
}
