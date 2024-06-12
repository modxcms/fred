<?php

namespace Fred\Processors\ThemedTemplates;

use Fred\Model\FredThemedTemplate;
use MODX\Revolution\Processors\Model\RemoveProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends RemoveProcessor
{
    use \Fred\Traits\Processors\ThemedTemplates\Remove;

    public $classKey = FredThemedTemplate::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.themed_templates';
    public $primaryKeyField = 'template';
    public $permissions = ['fred_themed_templates_delete'];
}
