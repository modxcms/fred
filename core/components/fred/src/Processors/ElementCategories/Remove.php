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
    public $classKey = FredElementCategory::class;
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_categories';

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_element_category_delete')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }
}
