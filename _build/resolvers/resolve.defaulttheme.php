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
                [
                    'core_path' => $corePath
                ]
            );

            $templates = $modx->getCount('FredTheme');
            if ($templates === 0) {
                $themeFolder = 'default';

                /** @var FredTheme $theme */
                $theme = $modx->newObject('FredTheme');
                $theme->set('name', 'Default');
                $theme->set('theme_folder', $themeFolder);
                $theme->set('description', 'Fred\'s Default Theme');

                $theme->save();

                $path = rtrim($modx->getOption('assets_path'), '/') . '/themes/' . $themeFolder . '/';

                $nfp = $modx->getOption('new_folder_permissions');
                $amode = !empty($nfp) ? octdec($modx->getOption('new_folder_permissions')) : 0777;
                if (!is_dir($path)) {
                    mkdir($path, $amode, true);
                }
            }

            break;
    }
}
return true;
