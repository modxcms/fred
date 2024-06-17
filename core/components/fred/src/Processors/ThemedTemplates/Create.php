<?php

namespace Fred\Processors\ThemedTemplates;

use Fred\Model\FredThemedTemplate;
use MODX\Revolution\Processors\Processor;

/**
 * @package fred
 * @subpackage processors
 */
class Create extends Processor
{
    use \Fred\Traits\Processors\ThemedTemplates\Create;

    public $classKey = FredThemedTemplate::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.themed_templates';
    public $permissions = ['fred_themed_templates_save'];
}
