<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredBlueprintCategoriesRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'FredBlueprintCategory';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.blueprint_categories';

}

return 'FredBlueprintCategoriesRemoveProcessor';