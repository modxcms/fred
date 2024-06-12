<?php

namespace Fred\Endpoint\Ajax;

use Fred\Model\FredBlueprint;
use Fred\Model\FredBlueprintCategory;
use Fred\Model\FredBlueprintTemplateAccess;

class BlueprintsCreateBlueprint extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\BlueprintsCreateBlueprint;

    private $blueprintCategoryClass = FredBlueprintCategory::class;
    private $blueprintClass = FredBlueprint::class;
    private $blueprintTemplateAccessClass = FredBlueprintTemplateAccess::class;
}
