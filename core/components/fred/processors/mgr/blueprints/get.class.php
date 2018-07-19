<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredBlueprintsGetProcessor extends modObjectGetProcessor
{
    public $classKey = 'FredBlueprint';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.blueprints';

}

return 'FredBlueprintsGetProcessor';