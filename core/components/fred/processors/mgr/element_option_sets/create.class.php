<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementOptionSetsCreateProcessor extends modObjectCreateProcessor
{
    public $classKey = 'FredElementOptionSet';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.element_option_sets';
    /** @var FredElementSetting $object */
    public $object;

    public function beforeSet()
    {
        $name = $this->getProperty('name');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.element_settings_ns_name'));
        } else {
            if ($this->doesAlreadyExist(array('name' => $name))) {
                $this->addFieldError('name', $this->modx->lexicon('fred.err.element_settings_ae_name'));
            }
        }

        return parent::beforeSet();
    }

}

return 'FredElementOptionSetsCreateProcessor';