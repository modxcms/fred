<?php

namespace Fred\v2\Processors\ElementCategories;

/**
 * @package fred
 * @subpackage processors
 */

class Duplicate extends \modObjectDuplicateProcessor
{
    use \Fred\Traits\Processors\ElementCategories\Duplicate;

    public $classKey = 'FredElementCategory';
    public $templateAccessClass = 'FredElementCategoryTemplateAccess';
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_categories';
}
