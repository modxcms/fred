<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementRTEConfigsGetProcessor extends modObjectGetProcessor
{
    public $classKey = 'FredElementRTEConfig';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.element_rte_configs';

}

return 'FredElementRTEConfigsGetProcessor';