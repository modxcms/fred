<?php

namespace Fred\v2\Processors\Themes;

/**
 * @package fred
 * @subpackage processors
 */
class Update extends \modObjectUpdateProcessor
{
    use \Fred\Traits\Processors\Themes\Update;

    public $classKey = 'FredTheme';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.theme';
    public $permissions = ['fred_themes_save'];

    public $object;
}
