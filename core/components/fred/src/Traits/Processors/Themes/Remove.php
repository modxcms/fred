<?php

namespace Fred\Traits\Processors\Themes;

use Symfony\Component\Filesystem\Filesystem;

/**
 * @package fred
 * @subpackage processors
 */
trait Remove
{
    use \Fred\Traits\Processors\PermissionCheck;

    public function afterRemove()
    {
        $deleteThemeFolder = (int)$this->getProperty('delete_theme_folder', 0);
        $themeFolder = $this->object->get('theme_folder');

        if (!empty($themeFolder)) {
            if ($deleteThemeFolder === 1) {
                try {
                    $fs = new Filesystem();

                    $fs->remove([$this->object->getThemeFolderPath()]);
                } catch (\Exception $e) {
                }
            }
        }

        return true;
    }
}
