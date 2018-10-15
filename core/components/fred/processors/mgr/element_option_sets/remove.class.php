<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementOptionSetsRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'FredElementOptionSet';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.element_option_sets';

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_element_option_sets_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }
}

return 'FredElementOptionSetsRemoveProcessor';