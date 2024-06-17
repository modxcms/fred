<?php

namespace Fred\v2\Processors\Themes;

/**
 * @package fred
 * @subpackage processors
 */
class Create extends \modObjectCreateProcessor
{
    use \Fred\Traits\Processors\Themes\Create;

    public $classKey = 'FredTheme';

    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.theme';
    public $permissions = ['fred_themes_save'];

    public $object;
}
