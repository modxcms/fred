<?php

namespace Fred\Processors\ElementOptionSets;

use Fred\Model\FredElementOptionSet;
use MODX\Revolution\Processors\Model\GetProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Get extends GetProcessor
{
    public $classKey = FredElementOptionSet::class;
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_option_sets';
}
