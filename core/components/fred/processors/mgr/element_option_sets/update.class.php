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

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_element_option_sets_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }
    
    public function beforeSet()
    {
        $name = $this->getProperty('name');
        $theme = $this->getProperty('theme');

        if (empty($theme)) {
            $this->addFieldError('theme', $this->modx->lexicon('fred.err.element_option_sets_ns_theme'));
        }
        
        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.element_option_sets_ns_name'));
        } else {
            if ($this->modx->getCount($this->classKey, ['name' => $name, 'theme' => $theme, 'id:!=' => $this->object->id]) > 0) {
                $this->addFieldError('name', $this->modx->lexicon('fred.err.element_option_sets_ae_name'));
            }
        }

        return parent::beforeSet();
    }
}

return 'FredElementOptionSetsUpdateProcessor';