<?php

namespace Fred\v2\Processors\ElementRTEConfigs;

/**
 * @package fred
 * @subpackage processors
 */
class Update extends \modObjectUpdateProcessor
{
    use \Fred\Traits\Processors\ElementRTEConfigs\Update;

    public $classKey = 'FredElementRTEConfig';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_rte_configs';

    public $object;
}
