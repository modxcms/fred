<?php

namespace Fred\v2\Processors\BlueprintCategories;

/**
 * @package fred
 * @subpackage processors
 */
class Update extends \modObjectUpdateProcessor
{
    use \Fred\Traits\Processors\BlueprintCategories\Update;

    public $classKey = 'FredBlueprintCategory';
    public $templateAccessClass = 'FredBlueprintCategoryTemplateAccess';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.blueprint_categories';
    public $permissions = ['fred_blueprint_categories_save'];

    public $object;
}
