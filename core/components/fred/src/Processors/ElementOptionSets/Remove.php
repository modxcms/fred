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
    use \Fred\Traits\Processors\ElementOptionSets\Remove;

    public $classKey = FredElementOptionSet::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_option_sets';
    public $permissions = ['fred_element_option_sets_save'];
}
