<?php

namespace Fred\Processors\Elements;

use Fred\Model\FredBlueprintCategory;
use Fred\Model\FredElement;
use Fred\Model\FredElementTemplateAccess;
use MODX\Revolution\Processors\Model\UpdateProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Update extends UpdateProcessor
{
    use \Fred\Traits\Processors\Elements\Update;

    public $classKey = FredElement::class;
    public $templateAccessClass = FredElementTemplateAccess::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.elements';
    public $permissions = ['fred_element_save'];

    public $object;
}
