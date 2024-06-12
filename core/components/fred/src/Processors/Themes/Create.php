<?php

namespace Fred\Processors\Themes;

use Fred\Model\FredTheme;
use MODX\Revolution\Processors\Model\CreateProcessor;

/**
 * @package fred
 * @subpackage processors
 */
class Create extends CreateProcessor
{
    use \Fred\Traits\Processors\Themes\Create;

    public $classKey = FredTheme::class;

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.theme';
    public $permissions = ['fred_themes_save'];

    public $object;
}
