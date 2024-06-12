<?php

namespace Fred\v2\Processors\ElementOptionSets;

/**
 * @package fred
 * @subpackage processors
 */
class Update extends \modObjectUpdateProcessor
{
    use \Fred\Traits\Processors\ElementOptionSets\Update;

    public $classKey = 'FredElementOptionSet';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_option_sets';
    public $permissions = ['fred_element_option_sets_save'];

    public $object;
}
