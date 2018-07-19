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

}

return 'FredBlueprintsRemoveProcessor';