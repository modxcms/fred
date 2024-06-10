<?php

namespace Fred\Processors\ElementRTEConfigs;

use Fred\Model\FredElementRTEConfig;
use MODX\Revolution\Processors\Model\GetProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Get extends GetProcessor
{
    public $classKey = FredElementRTEConfig::class;
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_rte_configs';
}
