<?php

namespace Fred\Processors\Blueprints;

use Fred\Model\FredBlueprint;
use MODX\Revolution\Processors\Model\RemoveProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends RemoveProcessor
{
    public $classKey = FredBlueprint::class;
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.blueprints';

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_blueprints_delete')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }
}
