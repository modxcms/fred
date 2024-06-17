<?php

namespace Fred\Processors\ElementCategories;

use Fred\Model\FredElementCategory;
use Fred\Model\FredElementCategoryTemplateAccess;
use MODX\Revolution\Processors\Model\DuplicateProcessor;

/**
 * @package fred
 * @subpackage processors
 */

class Duplicate extends DuplicateProcessor
{
    use \Fred\Traits\Processors\ElementCategories\Duplicate;

    public $classKey = FredElementCategory::class;
    public $templateAccessClass = FredElementCategoryTemplateAccess::class;
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_categories';
}
