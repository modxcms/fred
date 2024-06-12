<?php

namespace Fred\Processors\Elements;

use Fred\Model\FredElement;
use MODX\Revolution\Processors\Model\DuplicateProcessor;

/**
 * @package fred
 * @subpackage processors
 */

class Duplicate extends DuplicateProcessor
{
    use \Fred\Traits\Processors\Elements\Duplicate;

    public $classKey = FredElement::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.elements';
    public $permissions = ['fred_element_save'];
}
