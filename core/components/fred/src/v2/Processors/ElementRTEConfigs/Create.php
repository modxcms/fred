<?php

namespace Fred\v2\Processors\ElementRTEConfigs;

/**
 * @package fred
 * @subpackage processors
 */
class Create extends \modObjectCreateProcessor
{
    use \Fred\Traits\Processors\ElementRTEConfigs\Create;

    public $classKey = 'FredElementRTEConfig';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_rte_configs';
    public $permissions = ['fred_element_rte_config_save'];

    public $object;
}
