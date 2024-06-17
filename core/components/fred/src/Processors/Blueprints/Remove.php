<?php

namespace Fred\Processors\Blueprints;

use Fred\Model\FredBlueprint;
use MODX\Revolution\Processors\Model\RemoveProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends RemoveProcessor
{
    use \Fred\Traits\Processors\Blueprints\Remove;

    public $classKey = FredBlueprint::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.blueprints';
    public $permissions = ['fred_blueprint_delete'];
}
