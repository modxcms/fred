<?php

namespace Fred\v2\Processors\ElementRTEConfigs;

/**
 * @package fred
 * @subpackage processors
 */
class Get extends \modObjectGetProcessor
{
    public $classKey = 'FredElementRTEConfig';
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_rte_configs';
}
