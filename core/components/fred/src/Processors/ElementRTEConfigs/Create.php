<?php

namespace Fred\Processors\ElementRTEConfigs;

use Fred\Model\FredElementRTEConfig;
use MODX\Revolution\Processors\Model\CreateProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Create extends CreateProcessor
{
    use \Fred\Traits\Processors\ElementRTEConfigs\Create;

    public $classKey = FredElementRTEConfig::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_rte_configs';
    public $permissions = ['fred_element_rte_config_save'];

    public $object;
}
