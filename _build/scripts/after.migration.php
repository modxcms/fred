<?php

use Fred\Model\FredElement;
use MODX\Revolution\modX;
use MODX\Revolution\Transport\modTransportPackage;
use xPDO\Transport\xPDOTransport;

/**
 * @var xPDOTransport $transport
 * @var array $object
 * @var array $options
 */

set_time_limit(0);

if (!function_exists('replaceIdWithUuidOnElements')) {
    /**
     * @param modX $modx
     * @param array $cache
     * @param array $data
     */
    function replaceIdWithUuidOnElements($modx, &$cache, &$data)
    {
        foreach ($data as &$dropZone) {
            if (!is_array($dropZone)) {
                continue;
            }

            foreach ($dropZone as &$element) {
                $elementId = intval($element['widget']);

                if (!isset($cache[$elementId])) {
                    /** @var FredElement $fredElement */
                    $fredElement = $modx->getObject(FredElement::class, ['id' => $elementId]);
                    if ($fredElement) {
                        $cache[$elementId] = $fredElement->uuid;
                        $element['widget'] = $cache[$elementId];
                    }
                } else {
                    $element['widget'] = $cache[$elementId];
                }

                replaceIdWithUuidOnElements($modx, $cache, $element['children']);
            }
        }
    }
}

if (!function_exists('iterateElements')) {
    /**
     * @param modX $modx
     * @param array $cache
     * @param array $data
     */
    function iterateElements($modx, &$cache, &$data)
    {
        foreach ($data as &$element) {
            $elementId = $element['widget'];

            if (!isset($elements[$elementId])) {
                /** @var FredElement $fredElement */
                $fredElement = $modx->getObject(FredElement::class, ['id' => $elementId]);
                if ($fredElement) {
                    $cache[$elementId] = $fredElement->uuid;
                    $element['widget'] = $cache[$elementId];
                }
            } else {
                $element['widget'] = $cache[$elementId];
            }

            replaceIdWithUuidOnElements($modx, $cache, $element['children']);
        }
    }
}

switch ($options[xPDOTransport::PACKAGE_ACTION]) {
    case xPDOTransport::ACTION_UPGRADE:
        /** @var modX $modx */
        $modx =& $transport->xpdo;

        // http://forums.modx.com/thread/88734/package-version-check#dis-post-489104
        $c = $modx->newQuery(modTransportPackage::class);
        $c->where([
            'workspace' => 1,
            "(SELECT
                    `signature`
                  FROM {$modx->getTableName(modTransportPackage::class)} AS `latestPackage`
                  WHERE `latestPackage`.`package_name` = `modTransportPackage`.`package_name`
                  ORDER BY
                     `latestPackage`.`version_major` DESC,
                     `latestPackage`.`version_minor` DESC,
                     `latestPackage`.`version_patch` DESC,
                     IF(`release` = '' OR `release` = 'ga' OR `release` = 'pl','z',`release`) DESC,
                     `latestPackage`.`release_index` DESC
                  LIMIT 1,1) = `modTransportPackage`.`signature`",
        ]);
        $c->where(
            [
                'modTransportPackage.package_name' => 'fred',
                'installed:IS NOT' => null
            ]
        );

        /** @var modTransportPackage $oldPackage */
        $oldPackage = $modx->getObject(modTransportPackage::class, $c);

        /** @var \Fred\Fred $fred */
        $fred = $modx->services->get('fred');

//        if ($oldPackage && $oldPackage->compareVersion('2.0.0-pl', '>')) {
//
//        }

        break;
}

return true;
