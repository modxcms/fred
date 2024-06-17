<?php

namespace Fred\Traits\Processors\Themes;

use Symfony\Component\Filesystem\Filesystem;

/**
 * @package fred
 * @subpackage processors
 */

trait Duplicate
{
    use \Fred\Traits\Processors\PermissionCheck;

    public function process()
    {
        $this->newObject->fromArray($this->object->toArray());
        $name = $this->getProperty('name');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.theme_ns_name'));
            return $this->failure();
        }

        $this->newObject->set('name', $name);
        $this->newObject->set('uuid', '');
        $this->newObject->set('config', []);
        $this->newObject->set('theme_folder', $name);

        if ($this->saveObject() === false) {
            $this->modx->error->checkValidation($this->newObject);
            return $this->failure($this->modx->lexicon($this->objectType . '_err_duplicate'));
        }

        $this->duplicateThemeObjects();
        $this->createThemeFolder();
        $this->duplicateThemeFolder();
        $this->duplicateTemplates();

        return $this->success('');
    }

    protected function replaceIdWithUuidOnElements(&$data, $map)
    {
        foreach ($data as &$dropZone) {
            if (!is_array($dropZone)) {
                continue;
            }

            foreach ($dropZone as &$element) {
                $elementId = $element['widget'];

                if ($map[$elementId]) {
                    $element['widget'] = $map[$elementId];
                } else {
                    $element['widget'] = '';
                }

                $this->replaceIdWithUuidOnElements($element['children'], $map);
            }
        }
    }

    protected function iterateElements(&$data, $map)
    {
        foreach ($data as &$element) {
            $elementId = $element['widget'];

            if ($map[$elementId]) {
                $element['widget'] = $map[$elementId];
            } else {
                $element['widget'] = '';
            }

            $this->replaceIdWithUuidOnElements($element['children'], $map);
        }
    }

    protected function createThemeFolder()
    {
        $themeFolder = $this->newObject->get('theme_folder');

        if (!empty($themeFolder)) {
            $path = rtrim($this->modx->getOption('assets_path'), '/') . '/themes/' . $themeFolder . '/';

            $nfp = $this->modx->getOption('new_folder_permissions');
            $amode = !empty($nfp) ? octdec($this->modx->getOption('new_folder_permissions')) : 0777;
            if (!is_dir($path)) {
                mkdir($path, $amode, true);
            }
        }
    }

    protected function duplicateThemeFolder()
    {
        $duplicateThemeFolder = (int)$this->getProperty('duplicate_theme_folder', 0);

        if ($duplicateThemeFolder !== 1) {
            return;
        }

        try {
            $fs = new Filesystem();

            $originalThemeFolderPath = $this->object->getThemeFolderPath();
            $themeFolderPath = $this->newObject->getThemeFolderPath();

            $fs->mirror($originalThemeFolderPath, $themeFolderPath);
        } catch (\Exception $e) {
        }
    }
}
