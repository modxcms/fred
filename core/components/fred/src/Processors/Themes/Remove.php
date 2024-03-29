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
    public $classKey = FredTheme::class;
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.theme';

    /** @var FredTheme */
    public $object;

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_themes_delete')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }

    public function afterRemove()
    {
        $deleteThemeFolder = (int)$this->getProperty('delete_theme_folder', 0);
        $themeFolder = $this->object->get('theme_folder');

        if (!empty($themeFolder)) {
            if ($deleteThemeFolder === 1) {
                try {
                    $fs = new Filesystem();

                    $fs->remove([$this->object->getThemeFolderPath()]);
                } catch (\Exception $e) {}
            }
        }

        return true;
    }
}
