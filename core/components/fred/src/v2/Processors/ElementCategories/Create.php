<?php

namespace Fred\v2\Processors\ElementCategories;

/**
 * @package fred
 * @subpackage processors
 */
class Create extends \modObjectCreateProcessor
{
    use \Fred\Traits\Processors\ElementCategories\Create;

    public $classKey = 'FredElementCategory';
    public $templateAccessClass = 'FredElementCategoryTemplateAccess';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_categories';
    public $permissions = ['fred_element_category_save'];

    public $object;
}
