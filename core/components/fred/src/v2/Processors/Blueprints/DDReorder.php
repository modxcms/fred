<?php

namespace Fred\v2\Processors\Blueprints;

/**
 * @package fred
 * @subpackage processors
 */
class DDReorder extends \modObjectProcessor
{
    use \Fred\Traits\Processors\Blueprints\DDReorder;

    public $classKey = 'FredBlueprint';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.blueprints';
    public $permissions = ['fred_blueprint_save'];
}
