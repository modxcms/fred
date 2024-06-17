<?php

namespace Fred\Processors\Themes;

use Fred\Model\FredTheme;
use MODX\Revolution\Processors\Model\UpdateProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Update extends UpdateProcessor
{
    use \Fred\Traits\Processors\Themes\Update;

    public $classKey = FredTheme::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.theme';
    public $permissions = ['fred_themes_save'];

    public $object;
}
