<?php

namespace Fred\v2\Processors\Elements;

/**
 * @package fred
 * @subpackage processors
 */

class Duplicate extends \modObjectDuplicateProcessor
{
    use \Fred\Traits\Processors\Elements\Duplicate;

    public $classKey = 'FredElement';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.elements';
    public $permissions = ['fred_element_save'];
}
