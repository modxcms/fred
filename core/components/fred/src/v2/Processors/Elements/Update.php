<?php

namespace Fred\v2\Processors\Elements;

/**
 * @package fred
 * @subpackage processors
 */
class Update extends \modObjectUpdateProcessor
{
    use \Fred\Traits\Processors\Elements\Update;

    public $classKey = 'FredElement';
    public $templateAccessClass = 'FredElementTemplateAccess';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.elements';
    public $permissions = ['fred_element_save'];

    public $object;
}
