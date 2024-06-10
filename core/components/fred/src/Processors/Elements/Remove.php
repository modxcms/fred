<?php

namespace Fred\Processors\Elements;

use Fred\Model\FredElement;
use MODX\Revolution\Processors\Model\RemoveProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends RemoveProcessor
{
    public $classKey = FredElement::class;
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
