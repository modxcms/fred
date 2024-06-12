<?php

namespace Fred\v2\Processors\ElementRTEConfigs;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends \modObjectRemoveProcessor
{
    use \Fred\Traits\Processors\ElementRTEConfigs\Remove;

    public $classKey = 'FredElementRTEConfig';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_rte_configs';
}
