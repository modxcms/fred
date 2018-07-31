<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementOptionSetsUpdateProcessor extends modObjectUpdateProcessor
{
    public $classKey = 'FredElementOptionSet';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.element_option_sets';
    /** @var FredElement $object */
    public $object;

    public function beforeSet()
    {
        $name = $this->getProperty('name');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.element_option_sets_ns_name'));
        } else {
            if ($this->modx->getCount($this->classKey, array('name' => $name, 'id:!=' => $this->object->id)) > 0) {
                $this->addFieldError('name', $this->modx->lexicon('fred.err.element_option_sets_ae_name'));
            }
        }

        return parent::beforeSet();
    }
}

return 'FredElementOptionSetsUpdateProcessor';