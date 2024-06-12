<?php

namespace Fred\v2\Processors\ElementCategories;

/**
 * @package fred
 * @subpackage processors
 */
class DDReorder extends \modObjectProcessor
{
    use \Fred\Traits\Processors\ElementCategories\DDReorder;

    public $classKey = 'FredElementCategory';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_categories';
    public $permissions = ['fred_element_category_save'];
}
