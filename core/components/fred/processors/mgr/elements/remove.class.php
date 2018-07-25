<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementsRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'FredElement';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.elements';

}

return 'FredElementsRemoveProcessor';