<?php

namespace Fred\Processors\ElementRTEConfigs;

use Fred\Model\FredElementRTEConfig;
use MODX\Revolution\Processors\Model\RemoveProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends RemoveProcessor
{
    use \Fred\Traits\Processors\ElementRTEConfigs\Remove;

    public $classKey = FredElementRTEConfig::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_rte_configs';
}
