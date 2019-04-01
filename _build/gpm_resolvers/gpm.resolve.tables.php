<?php
/**
 * Resolve creating db tables
 *
 * THIS RESOLVER IS AUTOMATICALLY GENERATED, NO CHANGES WILL APPLY
 *
 * @package fred
 * @subpackage build
 *
 * @var mixed $object
 * @var modX $modx
 * @var array $options
 */

if ($object->xpdo) {
    $modx =& $object->xpdo;
    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_INSTALL:
        case xPDOTransport::ACTION_UPGRADE:
            $modelPath = $modx->getOption('fred.core_path', null, $modx->getOption('core_path') . 'components/fred/') . 'model/';
            
            $modx->addPackage('fred', $modelPath, null);


            $manager = $modx->getManager();

            $manager->createObjectContainer('FredBlueprintCategory');
            $manager->createObjectContainer('FredBlueprint');
            $manager->createObjectContainer('FredElementCategory');
            $manager->createObjectContainer('FredElement');
            $manager->createObjectContainer('FredElementOptionSet');
            $manager->createObjectContainer('FredElementRTEConfig');
            $manager->createObjectContainer('FredTheme');
            $manager->createObjectContainer('FredThemedTemplate');
            $manager->createObjectContainer('FredCache');

            break;
    }
}

return true;