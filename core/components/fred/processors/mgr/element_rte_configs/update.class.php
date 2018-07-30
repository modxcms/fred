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

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.element_rte_configs_ns_name'));
        } else {
            if ($this->modx->getCount($this->classKey, array('name' => $name, 'id:!=' => $this->object->id)) > 0) {
                $this->addFieldError('name', $this->modx->lexicon('fred.err.element_rte_configs_ae_name'));
            }
        }

        return parent::beforeSet();
    }
}

return 'FredElementRTEConfigsUpdateProcessor';