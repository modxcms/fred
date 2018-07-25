<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredElementCategoriesRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'FredElementCategory';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.element_categories';

}

return 'FredElementCategoriesRemoveProcessor';