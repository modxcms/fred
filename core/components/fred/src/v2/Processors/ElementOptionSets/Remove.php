<?php

namespace Fred\v2\Processors\ElementOptionSets;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends \modObjectRemoveProcessor
{
    use \Fred\Traits\Processors\ElementOptionSets\Remove;

    public $classKey = 'FredElementOptionSet';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_option_sets';
    public $permissions = ['fred_element_option_sets_save'];
}
