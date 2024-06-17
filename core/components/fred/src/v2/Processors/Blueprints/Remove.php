<?php

namespace Fred\v2\Processors\Blueprints;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends \modObjectRemoveProcessor
{
    use \Fred\Traits\Processors\Blueprints\Remove;

    public $classKey = 'FredBlueprint';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.blueprints';
    public $permissions = ['fred_blueprint_delete'];
}
