<?php

namespace Fred\v2\Processors\ThemedTemplates;

/**
 * @package fred
 * @subpackage processors
 */
class Update extends \modObjectUpdateProcessor
{
    use \Fred\Traits\Processors\ThemedTemplates\Update;

    public $classKey = 'FredThemedTemplate';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.theme';
    public $primaryKeyField = 'template';
    public $permissions = ['fred_themed_templates_save'];

    public $object;
}
