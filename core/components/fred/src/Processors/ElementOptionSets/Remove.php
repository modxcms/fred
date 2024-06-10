<?php

namespace Fred\Processors\ElementOptionSets;

use Fred\Model\FredElementOptionSet;
use MODX\Revolution\Processors\Model\RemoveProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends RemoveProcessor
{
    public $classKey = FredElementOptionSet::class;
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_option_sets';

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_element_option_sets_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }
}
