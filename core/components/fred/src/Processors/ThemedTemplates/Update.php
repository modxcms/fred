<?php

namespace Fred\Processors\ThemedTemplates;

use Fred\Model\FredThemedTemplate;
use MODX\Revolution\Processors\Model\UpdateProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Update extends UpdateProcessor
{
    use \Fred\Traits\Processors\ThemedTemplates\Update;

    public $classKey = FredThemedTemplate::Class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.theme';
    public $primaryKeyField = 'template';
    public $permissions = ['fred_themed_templates_save'];

    public $object;
}
