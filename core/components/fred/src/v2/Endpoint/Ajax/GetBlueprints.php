<?php

namespace Fred\v2\Endpoint\Ajax;

class GetBlueprints extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\GetBlueprints;

    protected $allowedMethod = ['OPTIONS', 'GET'];
    private $blueprintClass = 'FredBlueprint';
    private $blueprintCategoryClass = 'FredBlueprintCategory';
    private $blueprintCategoryTemplateAccessClass = 'FredBlueprintCategoryTemplateAccess';
    private $blueprintTemplateAccessClass = 'FredBlueprintTemplateAccess';
}
