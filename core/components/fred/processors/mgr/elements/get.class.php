<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementsGetProcessor extends modObjectGetProcessor
{
    public $classKey = 'FredElement';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.elements';

}

return 'FredElementsGetProcessor';