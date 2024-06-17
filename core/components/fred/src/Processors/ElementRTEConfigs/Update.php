<?php

namespace Fred\Processors\ElementRTEConfigs;

use Fred\Model\FredElementRTEConfig;
use MODX\Revolution\Processors\Model\UpdateProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Update extends UpdateProcessor
{
    use \Fred\Traits\Processors\ElementRTEConfigs\Update;

    public $classKey = FredElementRTEConfig::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_rte_configs';

    public $object;
}
