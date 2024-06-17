<?php

namespace Fred\v2\Processors\ThemedTemplates;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends \modObjectRemoveProcessor
{
    use \Fred\Traits\Processors\ThemedTemplates\Remove;

    public $classKey = 'FredThemedTemplate';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.themed_templates';
    public $primaryKeyField = 'template';
    public $permissions = ['fred_themed_templates_delete'];
}
