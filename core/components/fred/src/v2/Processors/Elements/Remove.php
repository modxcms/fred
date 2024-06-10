<?php

namespace Fred\v2\Processors\Elements;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends \modObjectRemoveProcessor
{
    public $classKey = 'FredElement';
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.elements';

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_element_option_sets_delete')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }
}
