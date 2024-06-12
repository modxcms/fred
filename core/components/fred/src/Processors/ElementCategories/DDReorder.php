<?php

namespace Fred\Processors\ElementCategories;

use Fred\Model\FredElementCategory;
use MODX\Revolution\Processors\ModelProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class DDReorder extends ModelProcessor
{
    use \Fred\Traits\Processors\ElementCategories\DDReorder;

    public $classKey = FredElementCategory::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_categories';
    public $permissions = ['fred_element_category_save'];
}
