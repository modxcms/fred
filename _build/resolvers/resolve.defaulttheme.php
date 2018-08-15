<?php
if ($object->xpdo) {
    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_INSTALL:

        case xPDOTransport::ACTION_UPGRADE:
            /** @var modX $modx */
            $modx =& $object->xpdo;

            $corePath = $modx->getOption('fred.core_path', null, $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');
            $fred = $modx->getService(
                'fred',
                'Fred',
                $corePath . 'model/fred/',
                array(
                    'core_path' => $corePath
                )
            );

            $templates = $modx->getCount('FredTheme');
            if ($templates === 0) {
                /** @var FredTheme $theme */
                $theme = $modx->newObject('FredTheme');
                $theme->set('name', 'Default');
                $theme->set('description', 'Fred\'s Default Theme');

                $theme->save();
            }

            break;
    }
}
return true;