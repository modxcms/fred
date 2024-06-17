<?php

namespace Fred\Processors\ElementOptionSets;

use Fred\Model\FredElementOptionSet;
use MODX\Revolution\Processors\Model\DuplicateProcessor;

/**
 * @package fred
 * @subpackage processors
 */

class Duplicate extends DuplicateProcessor
{
    use \Fred\Traits\Processors\ElementOptionSets\Duplicate;

    public $classKey = FredElementOptionSet::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_option_sets';
    public $permissions = ['fred_element_option_sets_save'];
}
