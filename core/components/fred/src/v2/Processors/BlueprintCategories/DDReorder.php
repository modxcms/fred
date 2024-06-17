<?php

namespace Fred\v2\Processors\BlueprintCategories;

/**
 * @package fred
 * @subpackage processors
 */
class DDReorder extends \modObjectProcessor
{
    use \Fred\Traits\Processors\BlueprintCategories\DDReorder;

    public $classKey = 'FredBlueprintCategory';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.blueprint_categories';
    public $permissions = ['fred_blueprint_categories_save'];
}
