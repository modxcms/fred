<?php

namespace Fred\v2\Processors\ElementCategories;

/**
 * @package fred
 * @subpackage processors
 */
class Update extends \modObjectUpdateProcessor
{
    use \Fred\Traits\Processors\ElementCategories\Update;

    public $classKey = 'FredElementCategory';
    public $templateAccessClass = 'FredElementCategoryTemplateAccess';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_categories';
    public $permissions = ['fred_element_category_save'];

    public $object;
}
