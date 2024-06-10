<?php

namespace Fred\v2\Processors\Blueprints;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends \modObjectRemoveProcessor
{
    public $classKey = 'FredBlueprint';
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
