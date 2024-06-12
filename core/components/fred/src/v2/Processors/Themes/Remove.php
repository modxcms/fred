<?php

namespace Fred\v2\Processors\Themes;

use Symfony\Component\Filesystem\Filesystem;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends \modObjectRemoveProcessor
{
    use \Fred\Traits\Processors\Themes\Remove;

    public $classKey = 'FredTheme';

    public $languageTopics = array('fred:default');
    public $objectType = 'fred.theme';
    public $permissions = array('fred_themes_delete');

    public $object;
}
