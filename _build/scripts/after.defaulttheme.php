<?php

use Fred\Model\FredTheme;
use MODX\Revolution\modX;
use xPDO\Transport\xPDOTransport;

/**
 * @var xPDOTransport $transport
 * @var array $object
 * @var array $options
 */

switch ($options[xPDOTransport::PACKAGE_ACTION]) {
    case xPDOTransport::ACTION_INSTALL:
    case xPDOTransport::ACTION_UPGRADE:
        /** @var modX $modx */
        $modx =& $transport->xpdo;

        /** @var \Fred\Fred $fred */
        $fred = $modx->services->get('fred');

        $templates = $modx->getCount(FredTheme::class);
        if ($templates === 0) {
            $themeFolder = 'default';

            /** @var FredTheme $theme */
            $theme = $modx->newObject(FredTheme::class);
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

return true;
