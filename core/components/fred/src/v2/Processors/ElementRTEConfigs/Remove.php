<?php

namespace Fred\v2\Processors\ElementRTEConfigs;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends \modObjectRemoveProcessor
{
    public $classKey = 'FredElementRTEConfig';
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_rte_configs';

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_element_rte_config_delete')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }
}
