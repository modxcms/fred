<?php

namespace Fred\v2\Endpoint\Ajax;

class BlueprintsCreateCategory extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\BlueprintsCreateCategory;

    private $blueprintCategoryClass = 'FredBlueprintCategory';
    private $blueprintCategoryTemplateAccess = 'FredBlueprintCategoryTemplateAccess';
}
