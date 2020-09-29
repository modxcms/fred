<?php
/**
 * @package fred
 * @subpackage processors
 */

class FredElementRTEConfigsDuplicateProcessor extends modObjectDuplicateProcessor
{
    public $classKey = 'FredElementRTEConfig';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.element_rte_configs';

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_element_rte_config_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }

    public function process() {
        $this->newObject->fromArray($this->object->toArray());
        $name = $this->getProperty('name');
        $theme = $this->getProperty('theme');

        if (empty($theme)) {
            $this->addFieldError('theme', $this->modx->lexicon('fred.err.element_rte_configs_ns_theme'));
        }

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.element_rte_configs_ns_name'));
            return $this->failure();
        } else {
            $nameValid = preg_match('/^[a-zA-Z][a-zA-Z0-9]*$/', $name);
            if (!$nameValid) {
                $this->addFieldError('name', $this->modx->lexicon('fred.err.element_rte_configs_invalid_name'));
                return $this->failure();
            }

            if ($this->modx->getCount($this->classKey, ['name' => $name, 'theme' => $theme]) > 0) {
                $this->addFieldError('name', $this->modx->lexicon('fred.err.element_rte_configs_ae_name'));
                return $this->failure();
            }
        }

        $this->newObject->set('name', $name);
        $this->newObject->set('theme', $theme);

        if ($this->saveObject() === false) {
            $this->modx->error->checkValidation($this->newObject);
            return $this->failure($this->modx->lexicon($this->objectType.'_err_duplicate'));
        }

        return $this->success('');
    }
}

return 'FredElementRTEConfigsDuplicateProcessor';
