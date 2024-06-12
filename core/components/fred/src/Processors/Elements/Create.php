<?php

namespace Fred\Processors\Elements;

use Fred\Model\FredElement;
use MODX\Revolution\Processors\Model\CreateProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Create extends CreateProcessor
{
    use \Fred\Traits\Processors\Elements\Create;

    public $classKey = FredElement::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.elements';
    public $permissions = ['fred_element_save'];

    public $object;
}
