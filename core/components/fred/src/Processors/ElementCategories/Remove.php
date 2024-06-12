<?php

namespace Fred\Processors\ElementCategories;

use Fred\Model\FredElementCategory;
use MODX\Revolution\Processors\Model\RemoveProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends RemoveProcessor
{
    use \Fred\Traits\Processors\ElementCategories\Remove;

    public $classKey = FredElementCategory::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_categories';
    public $permissions = ['fred_element_category_delete'];
}
