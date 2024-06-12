<?php

namespace Fred\v2\Processors\Elements;

/**
 * @package fred
 * @subpackage processors
 */
class DDReorder extends \modObjectProcessor
{
    use \Fred\Traits\Processors\Elements\DDReorder;

    public $classKey = 'FredElement';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.elements';
    public $permissions = ['fred_element_save'];
}
