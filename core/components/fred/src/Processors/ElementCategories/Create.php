<?php

namespace Fred\Processors\ElementCategories;

use Fred\Model\FredElementCategory;
use Fred\Model\FredElementCategoryTemplateAccess;
use MODX\Revolution\Processors\Model\CreateProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Create extends CreateProcessor
{
    use \Fred\Traits\Processors\ElementCategories\Create;

    public $classKey = FredElementCategory::class;
    public $templateAccessClass = FredElementCategoryTemplateAccess::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_categories';
    public $permissions = ['fred_element_category_save'];

    public $object;
}
