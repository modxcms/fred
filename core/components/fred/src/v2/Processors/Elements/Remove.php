<?php

namespace Fred\v2\Processors\Elements;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends \modObjectRemoveProcessor
{
    use \Fred\Traits\Processors\Elements\Remove;

    public $classKey = 'FredElement';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.elements';
    public $permissions = ['fred_element_save'];
}
