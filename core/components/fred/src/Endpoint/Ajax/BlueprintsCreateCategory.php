<?php

namespace Fred\Endpoint\Ajax;

use Fred\Model\FredBlueprintCategory;
use Fred\Model\FredBlueprintCategoryTemplateAccess;

class BlueprintsCreateCategory extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\BlueprintsCreateCategory;

    private $blueprintCategoryClass = FredBlueprintCategory::class;
    private $blueprintCategoryTemplateAccess = FredBlueprintCategoryTemplateAccess::class;
}
