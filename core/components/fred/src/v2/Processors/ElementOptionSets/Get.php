<?php

namespace Fred\v2\Processors\ElementOptionSets;

/**
 * @package fred
 * @subpackage processors
 */
class Get extends \modObjectGetProcessor
{
    public $classKey = 'FredElementOptionSet';
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.element_option_sets';
}
