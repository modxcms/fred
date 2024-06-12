<?php

namespace Fred\Processors\BlueprintCategories;

use Fred\Model\FredBlueprintCategory;
use Fred\Model\FredBlueprintCategoryTemplateAccess;
use MODX\Revolution\Processors\Model\CreateProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Create extends CreateProcessor
{
    use \Fred\Traits\Processors\BlueprintCategories\Create;

    public $classKey = FredBlueprintCategory::class;
    public $templateAccessClass = FredBlueprintCategoryTemplateAccess::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.blueprint_categories';
    public $permissions = ['fred_blueprint_categories_save'];

    public $object;
}
