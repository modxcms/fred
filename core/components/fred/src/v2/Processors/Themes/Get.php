<?php

namespace Fred\v2\Processors\Themes;


/**
 * @package fred
 * @subpackage processors
 */
class Get extends \modObjectGetProcessor
{
    public $classKey = 'FredTheme';
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.theme';
}
