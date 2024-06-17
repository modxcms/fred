<?php

namespace Fred\v2\Processors\ElementRTEConfigs;

/**
 * @package fred
 * @subpackage processors
 */

class Duplicate extends \modObjectDuplicateProcessor
{
    use \Fred\Traits\Processors\ElementRTEConfigs\Duplicate;

    public $classKey = 'FredElementRTEConfig';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_rte_configs';
    public $permissions = ['fred_element_rte_config_save'];
}
