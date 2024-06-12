<?php

namespace Fred\Processors\Blueprints;

use Fred\Model\FredBlueprint;
use MODX\Revolution\Processors\ModelProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class DDReorder extends ModelProcessor
{
    use \Fred\Traits\Processors\Blueprints\DDReorder;

    public $classKey = FredBlueprint::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.blueprints';
    public $permissions = ['fred_blueprint_save'];
}
