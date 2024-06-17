<?php

namespace Fred\v2\Processors\ElementOptionSets;

/**
 * @package fred
 * @subpackage processors
 */

class Duplicate extends \modObjectDuplicateProcessor
{
    use \Fred\Traits\Processors\ElementOptionSets\Duplicate;

    public $classKey = 'FredElementOptionSet';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_option_sets';
    public $permissions = ['fred_element_option_sets_save'];
}
