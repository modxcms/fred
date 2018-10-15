<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredBlueprintsRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'FredBlueprint';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.blueprints';

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_blueprints_delete')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }
}

return 'FredBlueprintsRemoveProcessor';