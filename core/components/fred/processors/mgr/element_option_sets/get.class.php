<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementOptionSetsGetProcessor extends modObjectGetProcessor
{
    public $classKey = 'FredElementOptionSet';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.element_option_sets';

}

return 'FredElementOptionSetsGetProcessor';