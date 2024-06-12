<?php

namespace Fred\Processors\ElementRTEConfigs;

use Fred\Model\FredElementRTEConfig;
use MODX\Revolution\Processors\Model\DuplicateProcessor;

/**
 * @package fred
 * @subpackage processors
 */

class Duplicate extends DuplicateProcessor
{
    use \Fred\Traits\Processors\ElementRTEConfigs\Duplicate;

    public $classKey = FredElementRTEConfig::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_rte_configs';
    public $permissions = ['fred_element_rte_config_save'];
}
