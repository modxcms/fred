<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementsRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'FredElement';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.elements';

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_element_delete')) {
            return $this->modx->lexicon('access_denied');
        }
        
        return parent::initialize();
    }


}

return 'FredElementsRemoveProcessor';