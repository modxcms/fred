<?php

namespace Fred\v2\Processors\Elements;

/**
 * @package fred
 * @subpackage processors
 */
class Get extends \modObjectGetProcessor
{
    use \Fred\Traits\Processors\Elements\Get;

    public $classKey = 'FredElement';
    public $templateAccessClass = 'FredElementTemplateAccess';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.elements';

    public $object;
}
