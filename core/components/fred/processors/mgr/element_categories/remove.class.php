<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementCategoriesRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'FredElementCategory';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.element_categories';

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_element_category_delete')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }
}

return 'FredElementCategoriesRemoveProcessor';