<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementOptionSetsRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'FredElementOptionSet';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.element_option_sets';
}

return 'FredElementOptionSetsRemoveProcessor';