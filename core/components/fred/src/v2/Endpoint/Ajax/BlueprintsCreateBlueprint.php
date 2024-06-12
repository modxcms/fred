<?php

namespace Fred\v2\Endpoint\Ajax;

class BlueprintsCreateBlueprint extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\BlueprintsCreateBlueprint;

    private $blueprintCategoryClass = 'FredBlueprintCategory';
    private $blueprintClass = 'FredBlueprint';
    private $blueprintTemplateAccessClass = 'FredBlueprintTemplateAccess';
}
