<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementRTEConfigsCreateProcessor extends modObjectCreateProcessor
{
    public $classKey = 'FredElementRTEConfig';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.element_rte_configs';
    /** @var FredElementRTEConfig $object */
    public $object;

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_element_rte_config_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }

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
            $nameValid = preg_match('/^[a-zA-Z][a-zA-Z0-9]*$/', $name);
            if (!$nameValid) {
                $this->addFieldError('name', $this->modx->lexicon('fred.err.element_rte_configs_invalid_name'));
            } else {
                if ($this->doesAlreadyExist(['name' => $name, 'theme' => $theme])) {
                    $this->addFieldError('name', $this->modx->lexicon('fred.err.element_rte_configs_ae_name'));
                }
            }
        }

        return parent::beforeSet();
    }

}

return 'FredElementRTEConfigsCreateProcessor';
