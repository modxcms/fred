<?php

namespace Fred\Processors\Themes;

use Fred\Model\FredTheme;
use MODX\Revolution\Processors\Model\RemoveProcessor;
use Symfony\Component\Filesystem\Filesystem;

/**
 * @package fred
 * @subpackage processors
 */
class Remove extends RemoveProcessor
{
    use \Fred\Traits\Processors\Themes\Remove;

    public $classKey = FredTheme::class;

    public $languageTopics = array('fred:default');
    public $objectType = 'fred.theme';
    public $permissions = array('fred_themes_delete');

    public $object;
}
