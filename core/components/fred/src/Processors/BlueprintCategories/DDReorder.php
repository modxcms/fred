<?php

namespace Fred\Processors\BlueprintCategories;

use Fred\Model\FredBlueprintCategory;
use MODX\Revolution\Processors\ModelProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class DDReorder extends ModelProcessor
{
    use \Fred\Traits\Processors\BlueprintCategories\DDReorder;

    public $classKey = FredBlueprintCategory::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.blueprint_categories';
    public $permissions = ['fred_blueprint_categories_save'];
}
