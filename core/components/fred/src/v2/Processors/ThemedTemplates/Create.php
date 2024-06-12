<?php

namespace Fred\v2\Processors\ThemedTemplates;

/**
 * @package fred
 * @subpackage processors
 */
class Create extends \modProcessor
{
    use \Fred\Traits\Processors\ThemedTemplates\Create;

    public $classKey = 'FredThemedTemplate';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.themed_templates';
    public $permissions = ['fred_themed_templates_save'];
}
