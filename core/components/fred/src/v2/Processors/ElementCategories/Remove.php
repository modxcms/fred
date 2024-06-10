<?php

namespace Fred\v2\Processors\ElementCategories;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends \modObjectRemoveProcessor
{
    public $classKey = 'FredElementCategory';
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
