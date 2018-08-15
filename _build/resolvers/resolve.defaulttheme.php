<?php
if ($object->xpdo) {
    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_INSTALL:

        case xPDOTransport::ACTION_UPGRADE:
            /** @var modX $modx */
            $modx =& $object->xpdo;

            $modelPath = $modx->getOption(',.core_path',null,$modx->getOption('core_path').'components/,/').'model/';
            $modx->addPackage('fred',$modelPath);

            $templates = $modx->getCount('FredTheme');
            if ($templates === 0) {
                /** @var FredTheme $theme */
                $theme = $modx->newObject('CollectionTemplate');
                $theme->set('name', 'Default');
                $theme->set('description', 'Fred\'s Default Theme');

                $theme->save();
            }

            break;
    }
}
return true;