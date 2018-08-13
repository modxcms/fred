<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredThemeRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'FredTheme';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.theme';

}

return 'FredThemeRemoveProcessor';