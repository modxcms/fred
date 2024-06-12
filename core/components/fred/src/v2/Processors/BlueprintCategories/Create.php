<?php

namespace Fred\v2\Processors\BlueprintCategories;

/**
 * @package fred
 * @subpackage processors
 */
class Create extends \modObjectCreateProcessor
{
    use \Fred\Traits\Processors\BlueprintCategories\Create;

    public $classKey = 'FredBlueprintCategory';
    public $templateAccessClass = 'FredBlueprintCategoryTemplateAccess';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.blueprint_categories';
    public $permissions = ['fred_blueprint_categories_save'];

    public $object;
}
