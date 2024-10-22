<?php

namespace Fred\Processors\Themes;

use Fred\Model\FredTheme;
use MODX\Revolution\Processors\Model\GetProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Get extends GetProcessor
{
    public $classKey = FredTheme::class;
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.theme';
}
