<?php

namespace Fred\Endpoint\Ajax;

use Fred\Model\FredBlueprint;
use Fred\Model\FredBlueprintCategory;
use Fred\Model\FredBlueprintCategoryTemplateAccess;
use Fred\Model\FredBlueprintTemplateAccess;

class GetBlueprints extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\GetBlueprints;

    protected $allowedMethod = ['OPTIONS', 'GET'];
    private $blueprintClass = FredBlueprint::class;
    private $blueprintCategoryClass = FredBlueprintCategory::class;
    private $blueprintCategoryTemplateAccessClass = FredBlueprintCategoryTemplateAccess::class;
    private $blueprintTemplateAccessClass = FredBlueprintTemplateAccess::class;
}
