<?php

namespace Fred\v2\Processors\Blueprints;

/**
 * @package fred
 * @subpackage processors
 */
class Update extends \modObjectUpdateProcessor
{
    use \Fred\Traits\Processors\Blueprints\Update;

    public $classKey = 'FredBlueprint';
    public $templateAccessClass = 'FredBlueprintTemplateAccess';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.blueprints';
    public $permissions = ['fred_blueprints_save'];

    public $object;
}
