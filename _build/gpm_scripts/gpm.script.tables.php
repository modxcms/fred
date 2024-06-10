<?php

use xPDO\Transport\xPDOTransport;

/**
 * Create tables
 *
 * THIS SCRIPT IS AUTOMATICALLY GENERATED, NO CHANGES WILL APPLY
 *
 * @package fred
 * @subpackage build.scripts
 *
 * @var \xPDO\Transport\xPDOTransport $transport
 * @var array $object
 * @var array $options
 */

$modx =& $transport->xpdo;

if ($options[xPDOTransport::PACKAGE_ACTION] === xPDOTransport::ACTION_UNINSTALL) {
    return true;
}

$manager = $modx->getManager();

$manager->createObjectContainer(\Fred\Model\FredBlueprintCategory::class);
$manager->createObjectContainer(\Fred\Model\FredBlueprint::class);
$manager->createObjectContainer(\Fred\Model\FredElementCategory::class);
$manager->createObjectContainer(\Fred\Model\FredElement::class);
$manager->createObjectContainer(\Fred\Model\FredElementOptionSet::class);
$manager->createObjectContainer(\Fred\Model\FredElementRTEConfig::class);
$manager->createObjectContainer(\Fred\Model\FredTheme::class);
$manager->createObjectContainer(\Fred\Model\FredThemedTemplate::class);
$manager->createObjectContainer(\Fred\Model\FredCache::class);
$manager->createObjectContainer(\Fred\Model\FredElementCategoryTemplateAccess::class);
$manager->createObjectContainer(\Fred\Model\FredElementTemplateAccess::class);
$manager->createObjectContainer(\Fred\Model\FredBlueprintCategoryTemplateAccess::class);
$manager->createObjectContainer(\Fred\Model\FredBlueprintTemplateAccess::class);

return true;
