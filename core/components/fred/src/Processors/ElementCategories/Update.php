<?php

namespace Fred\Processors\ElementCategories;

use Fred\Model\FredElementCategory;
use Fred\Model\FredElementCategoryTemplateAccess;
use MODX\Revolution\Processors\Model\UpdateProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Update extends UpdateProcessor
{
    use \Fred\Traits\Processors\ElementCategories\Update;

    public $classKey = FredElementCategory::class;
    public $templateAccessClass = FredElementCategoryTemplateAccess::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_categories';
    public $permissions = ['fred_element_category_save'];

    public $object;
}
