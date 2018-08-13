<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementRTEConfigsUpdateProcessor extends modObjectUpdateProcessor
{
    public $classKey = 'FredElementRTEConfig';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.element_rte_configs';
    /** @var FredElement $object */
    public $object;

    public function beforeSet()
    {
        $name = $this->getProperty('name');
        $theme = $this->getProperty('theme');

        if (empty($theme)) {
            $this->addFieldError('theme', $this->modx->lexicon('fred.err.element_rte_configs_ns_theme'));
        }
        
        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.element_rte_configs_ns_name'));
        } else {
            if ($this->modx->getCount($this->classKey, ['name' => $name, 'theme' => $theme, 'id:!=' => $this->object->id]) > 0) {
                $this->addFieldError('name', $this->modx->lexicon('fred.err.element_rte_configs_ae_name'));
            }
        }

        return parent::beforeSet();
    }
}

return 'FredElementRTEConfigsUpdateProcessor';