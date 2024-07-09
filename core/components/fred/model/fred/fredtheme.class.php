<?php

/**
 * @package fred
 */
class FredTheme extends xPDOSimpleObject
{
    public function save($cacheFlag = null)
    {
        $uuid = $this->get('uuid');

        if (empty($uuid)) {
            try {
                $this->set('uuid', \Fred\Utils::uuid());
            } catch (\Exception $e) {
            }
        }

        $namespace = $this->get('namespace');
        if (empty($namespace)) {
            $namespaceName = 'fred_theme_' . str_replace('.', '_', modResource::filterPathSegment($this->xpdo, $this->name));
            $this->_fields['namespace'] = $namespaceName;
            $this->setDirty('namespace');

            /** @var modNamespace $namespace */
            $namespace = $this->xpdo->getObject('modNamespace', ['name' => $namespaceName]);
            if (!$namespace) {
                $namespace = $this->xpdo->newObject('modNamespace');
                $namespace->set('name', $namespaceName);
                $namespace->save();
            }
        }

        $settingsPrefix = $this->get('settingsPrefix');
        if (empty($settingsPrefix)) {
            $settingsPrefixValue = 'fred.theme.' . modResource::filterPathSegment($this->xpdo, $this->name);
            $this->_fields['settingsPrefix'] = $settingsPrefixValue;
            $this->setDirty('settingsPrefix');
        }

        $themeDirSetting = $this->xpdo->getObject('modSystemSetting', ['key' => "{$this->settingsPrefix}.theme_dir"]);
        if (!$themeDirSetting) {
            $themeDirSetting = $this->xpdo->newObject('modSystemSetting');
            $themeDirSetting->set('key', "{$this->settingsPrefix}.theme_dir");
            $themeDirSetting->set('namespace', $this->namespace);
        }

        $themeDirSetting->set('value', $this->getThemeFolderUri());
        $themeDirSetting->save();

        /** @var $themeDirLexicon $lexicons */
        $themeDirLexicon = $this->xpdo->getObject('modLexiconEntry', [
            'namespace' => $this->namespace,
            'name' => "setting_{$this->settingsPrefix}.theme_dir"
        ]);
        if (!$themeDirLexicon) {
            $themeDirLexicon = $this->xpdo->newObject('modLexiconEntry');
            $themeDirLexicon->set('namespace', $this->namespace);
            $themeDirLexicon->set('name', "setting_{$this->settingsPrefix}.theme_dir");
            $themeDirLexicon->set('language', "en");
        }
        $themeDirLexicon->set('value', 'Theme Directory');
        $themeDirLexicon->save();

        /** @var modLexiconEntry $themeDirDescLexicon */
        $themeDirDescLexicon = $this->xpdo->getObject('modLexiconEntry', [
            'namespace' => $this->namespace,
            'name' => "setting_{$this->settingsPrefix}.theme_dir_desc"
        ]);
        if (!$themeDirDescLexicon) {
            $themeDirDescLexicon = $this->xpdo->newObject('modLexiconEntry');
            $themeDirDescLexicon->set('namespace', $this->namespace);
            $themeDirDescLexicon->set('name', "setting_{$this->settingsPrefix}.theme_dir_desc");
            $themeDirDescLexicon->set('language', "en");
        }
        $themeDirDescLexicon->set('value', 'WARNING! DO NOT CHANGE! This setting is automatically generated.');
        $themeDirDescLexicon->save();

        $this->xpdo->cacheManager->refresh(
            [
                'system_settings' => []
            ]
        );

        return parent::save($cacheFlag);
    }

    public function set($k, $v = null, $vType = '')
    {
        if ($k === 'theme_folder') {
            $v = strtolower($v);
            $v = str_replace(' ', '_', $v);
            $v = str_replace('.', '', $v);
            $v = str_replace('/', '', $v);
        }

        if ($k === 'namespace') {
            return false;
        }
        if ($k === 'settingsPrefix') {
            return false;
        }

        return parent::set($k, $v, $vType);
    }

    public function remove(array $ancestors = [])
    {
        $namespace = $this->get('namespace');
        $response = parent::remove($ancestors);
        ;

        if ($response === true) {
            if (!empty($namespace)) {
                $modNamespace = $this->xpdo->getObject('modNamespace', ['name' => $namespace]);
                if ($modNamespace) {
                    $modNamespace->remove();
                }
            }
        }

        return $response;
    }

    public function getThemeFolderPath()
    {
        $customPath = $this->xpdo->getOption("$this->settingsPrefix.theme_dir.custom_path");
        if (!empty($customPath)) {
            return $this->parseThemeFolderPath($customPath);
        }

        $themeFolder = $this->get('theme_folder');

        if (empty($themeFolder)) {
            $this->set('theme_folder', $this->get('name'));
            $this->save();

            $themeFolder = $this->get('theme_folder');
        }

        $path = rtrim($this->xpdo->getOption('assets_path'), '/') . '/themes/' . $themeFolder . '/';

        return $path;
    }

    public function getThemeFolderUri()
    {
        $customUrl = $this->xpdo->getOption("$this->settingsPrefix.theme_dir.custom_url");
        if (!empty($customUrl)) {
            return $this->parseThemeFolderUri($customUrl);
        }

        $themeFolder = $this->get('theme_folder');

        if (empty($themeFolder)) {
            $this->set('theme_folder', $this->get('name'));
            $this->save();

            $themeFolder = $this->get('theme_folder');
        }

        $uri = rtrim($this->xpdo->getOption('assets_url'), '/') . '/themes/' . $themeFolder . '/';

        return $uri;
    }

    private function parseThemeFolderPath($path)
    {
        $assetsPath = $this->xpdo->getOption('assets_path');
        $assetsPath = rtrim($assetsPath, '/');

        $pkgAssetsPath = $this->xpdo->getOption("$this->settingsPrefix.assets_path", null, "$assetsPath/components/$this->namespace");
        $pkgAssetsPath = rtrim($pkgAssetsPath, '/');

        $path = str_replace('{{assets_path}}', $assetsPath, $path);
        $path = str_replace('{{pkg_assets_path}}', $pkgAssetsPath, $path);

        $path = rtrim($path, '/') . '/';

        return $path;
    }

    private function parseThemeFolderUri($uri)
    {
        $assetsUri = $this->xpdo->getOption('assets_url');
        $assetsUri = rtrim($assetsUri, '/');

        $pkgAssetsUri = $this->xpdo->getOption("$this->settingsPrefix.assets_url", null, "$assetsUri/components/$this->namespace");
        $pkgAssetsUri = rtrim($pkgAssetsUri, '/');

        $uri = str_replace('{{assets_url}}', $assetsUri, $uri);
        $uri = str_replace('{{pkg_assets_url}}', $pkgAssetsUri, $uri);

        $uri = rtrim($uri, '/') . '/';

        return $uri;
    }
}
