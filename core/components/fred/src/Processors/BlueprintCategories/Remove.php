<?php

namespace Fred\Processors\BlueprintCategories;

use Fred\Model\FredBlueprintCategory;
use MODX\Revolution\Processors\Model\RemoveProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends RemoveProcessor
{
    public $classKey = FredBlueprintCategory::class;
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
