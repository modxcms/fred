<?php

namespace Fred\Processors\ElementOptionSets;

use Fred\Model\FredElementOptionSet;
use MODX\Revolution\Processors\Model\UpdateProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Update extends UpdateProcessor
{
    use \Fred\Traits\Processors\ElementOptionSets\Update;

    public $classKey = FredElementOptionSet::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_option_sets';
    public $permissions = ['fred_element_option_sets_save'];

    public $object;
}
