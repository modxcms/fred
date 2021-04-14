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
    public $classKey = FredElementRTEConfig::class;
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
