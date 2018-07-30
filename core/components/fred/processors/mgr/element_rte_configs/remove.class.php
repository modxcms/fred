<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementRTEConfigsRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'FredElementRTEConfig';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.element_rte_configs';
}

return 'FredElementRTEConfigsRemoveProcessor';