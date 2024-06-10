<?php

namespace Fred\v2\Processors\BlueprintCategories;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends \modObjectRemoveProcessor
{
    public $classKey = 'FredBlueprintCategory';
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.blueprint_categories';

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_blueprint_categories_delete')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }
}
