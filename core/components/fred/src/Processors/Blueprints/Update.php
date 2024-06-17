<?php

namespace Fred\Processors\Blueprints;

use Fred\Model\FredBlueprint;
use Fred\Model\FredBlueprintTemplateAccess;
use MODX\Revolution\Processors\Model\UpdateProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Update extends UpdateProcessor
{
    use \Fred\Traits\Processors\Blueprints\Update;

    public $classKey = FredBlueprint::class;
    public $templateAccessClass = FredBlueprintTemplateAccess::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.blueprints';
    public $permissions = ['fred_blueprints_save'];

    public $object;
}
