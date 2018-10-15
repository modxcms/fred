<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredBlueprintCategoriesRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'FredBlueprintCategory';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.blueprint_categories';

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_blueprint_categories_delete')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }
}

return 'FredBlueprintCategoriesRemoveProcessor';