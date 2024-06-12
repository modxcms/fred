<?php

namespace Fred\Processors\Elements;

use Fred\Model\FredElement;
use Fred\Model\FredElementTemplateAccess;
use MODX\Revolution\Processors\Model\GetProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Get extends GetProcessor
{
    use \Fred\Traits\Processors\Elements\Get;

    public $classKey = FredElement::class;
    public $templateAccessClass = FredElementTemplateAccess::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.elements';

    public $object;
}
