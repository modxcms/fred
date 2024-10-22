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

            /** @var $namespace */
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

        /** @var $themeDirDescLexicon */
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

        $this->syncThemeSettings();

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

    public function getThemeSettingKey($key)
    {
        return "$this->settingsPrefix.setting.$key";
    }

    public function getThemeSettingXType($setting)
    {
        if (!empty($setting['xtype'])) return $setting['xtype'];

        switch ($setting['type']) {
            case 'slider':
                return 'numberfield';
            case 'toggle':
                return 'combo-boolean';
            case 'textarea':
                return 'textarea';
            case 'text':
            case 'page':
            case 'chunk':
            case 'file':
            case 'folder':
            case 'image':
            case 'tagger':
            case 'togglegroup':
            case 'colorswatch':
            case 'colorpicker':
            case 'select':
            default:
                return 'textfield';
        }
    }

    private function syncThemeSettings()
    {
        $settings = $this->get('settings');
        if (empty($settings) || !is_array($settings)) {
            $this->xpdo->removeCollection('modSystemSetting', ['namespace' => $this->namespace, 'key:LIKE' => "$this->settingsPrefix.setting.%"]);
            $this->xpdo->removeCollection('modContextSetting', ['namespace' => $this->namespace, 'key:LIKE' => "$this->settingsPrefix.setting.%"]);
            return;
        }

        $touchedSettings = [];

        foreach ($settings as $setting) {
            if (!empty($setting['group'])) {
                if (empty($setting['settings'])) {
                    continue;
                }

                foreach ($setting['settings'] as $groupSetting) {
                    $touchedSettings[] = $this->getThemeSettingKey($groupSetting['name']);
                    $groupSetting['xtype'] = $this->getThemeSettingXType($groupSetting);
                    $this->syncThemeSetting($groupSetting, $setting['group']);
                }
                continue;
            }

            $setting['xtype'] = $this->getThemeSettingXType($setting);
            $touchedSettings[] = $this->getThemeSettingKey($setting['name']);
            $this->syncThemeSetting($setting);
        }

        $where = [
            'namespace' => $this->namespace,
            'key:LIKE' => "$this->settingsPrefix.setting.%",
        ];

        if (!empty($touchedSettings)) {
            $where['key:NOT IN'] = $touchedSettings;
        }

        $this->xpdo->removeCollection('modSystemSetting', $where);
        $this->xpdo->removeCollection('modContextSetting', $where);
    }

    private function syncThemeSetting($setting, $group = '')
    {
        $systemSetting = $this->xpdo->getObject('modSystemSetting', ['namespace' => $this->namespace, 'key' => $this->getThemeSettingKey($setting['name'])]);
        if (!$systemSetting) {
            $systemSetting = $this->xpdo->newObject('modSystemSetting');
            $systemSetting->set('namespace', $this->namespace);
            $systemSetting->set('key', $this->getThemeSettingKey($setting['name']));

            $systemSetting->set('value', $this->themeSettingValueToModxPlaceholder($setting['value']));
        }

        $systemSetting->set('xtype', $setting['xtype']);
        $systemSetting->set('area', $group);
        $systemSetting->save();
    }

    public function saveThemeSettings($settingValues, $ctx)
    {
        $settings = $this->get('settings');
        if (empty($settings)) {
            return;
        }

        /** @var \modX $modx */
        $modx = $this->xpdo;

        if (!$modx->user->get('sudo')) {
            $settings = $this->filterThemeSettings($settings, false, false);
        }

        $keys = [];

        foreach ($settings as $setting) {
            if (isset($setting['group']) && is_array($setting['settings'])) {
                foreach ($setting['settings'] as $groupSetting) {
                    $keys[$groupSetting['name']] = [
                        'group' => $setting['group'],
                        'global' => isset($groupSetting['global']) ? $groupSetting['global'] : true
                    ];
                }
                continue;
            }

            $keys[$setting['name']] = [
                'group' => '',
                'global' => isset($setting['global']) ? $setting['global'] : true
            ];
        }

        foreach ($settingValues as $name => $value) {
            if (!isset($keys[$name])) {
                continue;
            }

            $setting = $this->xpdo->getObject('modSystemSetting', ['namespace' => $this->namespace, 'key' => $this->getThemeSettingKey($name)]);
            if (!$setting) {
                continue;
            }

            $newValue = $this->themeSettingValueToModxPlaceholder($value);
            if ($setting->get('value') === $newValue) {
                continue;
            }

            if ($keys[$name]['global'] === false) {
                $setting = $this->xpdo->getObject('modContextSetting', ['namespace' => $this->namespace, 'context_key' => $ctx, 'key' => $this->getThemeSettingKey($name)]);
                if (!$setting) {
                    $setting = $this->xpdo->newObject('modContextSetting');
                    $setting->set('namespace', $this->namespace);
                    $setting->set('key', $this->getThemeSettingKey($name));
                    $setting->set('context_key', $ctx);
                    $setting->set('area', $keys[$name]['group']);
                }
            }

            $setting->set('value', $this->themeSettingValueToModxPlaceholder($value));
            $setting->save();
        }

        $this->reloadSystemSettings();
    }

    protected function reloadSystemSettings()
    {
        /** @var \modX $modx */
        $modx = $this->xpdo;
        $modx->getCacheManager();
        $modx->cacheManager->refresh();

        $config = $modx->cacheManager->get('config', [
            \xPDO::OPT_CACHE_KEY => $modx->getOption('cache_system_settings_key', null, 'system_settings'),
            \xPDO::OPT_CACHE_HANDLER => $modx->getOption('cache_system_settings_handler', null, $modx->getOption(\xPDO::OPT_CACHE_HANDLER)),
            \xPDO::OPT_CACHE_FORMAT => (integer) $modx->getOption('cache_system_settings_format', null, $modx->getOption(\xPDO::OPT_CACHE_FORMAT, null, \xPDOCacheManager::CACHE_PHP)),
        ]);

        if (empty($config)) {
            $config = $modx->cacheManager->generateConfig();
        }

        if (empty($config)) {
            $config = [];
            if (!$settings = $modx->getCollection('modSystemSetting')) {
                return;
            }
            /** @var $setting */
            foreach ($settings as $setting) {
                $config[$setting->get('key')]= $setting->get('value');
            }
        }

        $modx->config = array_merge($modx->config, $config);
        $modx->_systemConfig = $modx->config;
    }

    public function themeSettingValueToModxPlaceholder($value)
    {
        $value = str_replace('{{theme_dir}}', "[[++{$this->settingsPrefix}.theme_dir]]", $value);

        return $value;
    }

    public function themeSettingValueFromModxPlaceholder($value)
    {
        $value = str_replace("[[++{$this->settingsPrefix}.theme_dir]]", '{{theme_dir}}', $value);

        return $value;
    }

    public function getAllSettingValues($withModxTags = false)
    {
        $settings = $this->get('settings');
        if (empty($settings)) {
            return [];
        }

        $output = [];

        foreach ($settings as $setting) {
            if (isset($setting['group']) && !empty($setting['settings'])) {
                foreach ($setting['settings'] as $gSetting) {
                    $output[$gSetting['name']] = $this->xpdo->getOption("$this->settingsPrefix.setting.{$gSetting['name']}");

                    if (!$withModxTags) {
                        $output[$gSetting['name']] = $this->themeSettingValueFromModxPlaceholder($output[$gSetting['name']]);
                    }
                }
                continue;
            }

            $output[$setting['name']] = $this->xpdo->getOption("$this->settingsPrefix.setting.{$setting['name']}");
            if (!$withModxTags) {
                $output[$setting['name']] = $this->themeSettingValueFromModxPlaceholder($output[$setting['name']]);
            }
        }

        return $output;
    }

    public function getSettings($twig = false)
    {
        $settings = $this->get('settings');
        if (empty($settings)) {
            return [];
        }

        foreach ($settings as $key => $setting) {
            if (isset($setting['group']) && !empty($setting['settings'])) {
                foreach ($setting['settings'] as $gKey => $gSetting) {
                    $value = $this->xpdo->getOption("$this->settingsPrefix.setting.{$gSetting['name']}");
                    if ($twig) {
                        $value = $this->themeSettingValueFromModxPlaceholder($value);
                    }
                    $settings[$key]['settings'][$gKey]['value'] = $value;
                    $settings[$key]['settings'][$gKey]['raw'] = $this->getRawValue($settings[$key]['settings'][$gKey]['value']);
                }
                continue;
            }
            $value = $this->xpdo->getOption("$this->settingsPrefix.setting.{$setting['name']}");
            if ($twig) {
                $value = $this->themeSettingValueFromModxPlaceholder($value);
            }
            $settings[$key]['value'] = $value;
            $settings[$key]['raw'] = $this->getRawValue($settings[$key]['value']);
        }

        /** @var \modX $modx */
        $modx = $this->xpdo;

        if (!$modx->user->get('sudo')) {
            $settings = $this->filterThemeSettings($settings, false, false);
        }

        return $settings;
    }

    public function getRawValue($value) {
        $value = str_replace('{{theme_dir}}', '[[++'. $this->settingsPrefix .'.theme_dir]]', $value);
        // check if it contains modx tags
        if (strpos($value, '[[') !== false) {

            /** @var \modX $modx */
            $modx = $this->xpdo;
            $currentResource = $modx->resource;
            $currentResourceIdentifier = $modx->resourceIdentifier;
            $currentElementCache = $modx->elementCache;
            $modx->request = new \modRequest($modx);
            $modx->request->sanitizeRequest();

            $modx->getParser();
            $maxIterations = 10;

            $resource = $modx->getObject('modResource', $modx->getOption('site_start'));

            $modx->resource = $resource;
            $modx->resourceIdentifier = $resource->get('id');
            $modx->elementCache = [];

            $modx->parser->processElementTags('', $value, false, false, '[[', ']]', [], $maxIterations);
            $modx->parser->processElementTags('', $value, true, false, '[[', ']]', [], $maxIterations);
            $modx->parser->processElementTags('', $value, true, true, '[[', ']]', [], $maxIterations);

            if (!empty($currentResource)) {
                $modx->resource = $currentResource;
                $modx->resourceIdentifier = $currentResourceIdentifier;
                $modx->elementCache = $currentElementCache;
            }
        }
        return $value;
    }

    public function getSettingKeys()
    {
        $settings = $this->get('settings');
        if (empty($settings)) {
            return [];
        }

        $keys = [];

        foreach ($settings as $setting) {
            if (isset($setting['group']) && is_array($setting['settings'])) {
                foreach ($setting['settings'] as $groupSetting) {
                    $keys[] = $groupSetting['name'];
                }
                continue;
            }

            $keys[] = $setting['name'];
        }

        return $keys;
    }

    private function filterThemeSettings($settings, $memberships, $rolesMap)
    {
        if ($memberships === false && $rolesMap === false) {
            /** @var \modX $modx */
            $modx = $this->xpdo;

            $memberships = [];
            $groups = $modx->user->getUserGroups();
            $roles = [];

            if (!empty($groups)) {
                /** @var $memberGroups */
                $memberGroups = $modx->getIterator('modUserGroupMember', ['user_group:IN' => $groups, 'member' => $modx->user->id]);
                foreach ($memberGroups as $memberGroup) {
                    $group = $memberGroup->getOne('UserGroup');
                    if (!$group) {
                        continue;
                    }

                    if (!isset($roles[$memberGroup->get('role')])) {
                        $role = $memberGroup->getOne('UserGroupRole');
                        if (!$role) {
                            continue;
                        }

                        $roles[$memberGroup->get('role')] = $role->get('authority');
                    }

                    $memberships[$group->get('name')] = $roles[$memberGroup->get('role')];
                }
            }

            $rolesMap = [];
            /** @var $userGroupRoles */
            $userGroupRoles = $modx->getIterator('modUserGroupRole');
            foreach ($userGroupRoles as $userGroupRole) {
                $rolesMap[$userGroupRole->get('name')] = $userGroupRole->get('authority');
            }
        }

        $filtered = [];

        foreach ($settings as $setting) {
            $matchAll = (isset($setting['userGroupMatchAll'])) ? $setting['userGroupMatchAll'] : false;

            if (isset($setting['userGroup']) && is_array($setting['userGroup'])) {
                $match = false;

                foreach ($setting['userGroup'] as $userGroup) {
                    if (is_array($userGroup)) {
                        if (!isset($memberships[$userGroup['group']])) {
                            $match = false;

                            if ($matchAll === true) {
                                continue 2;
                            } else {
                                continue;
                            }
                        }

                        if (isset($userGroup['role'])) {
                            if (!isset($rolesMap[$userGroup['role']])) {
                                continue 2;
                            }

                            if ($memberships[$userGroup['group']] <= $rolesMap[$userGroup['role']]) {
                                $match = true;

                                if ($matchAll === false) {
                                    break;
                                }
                            } else {
                                $match = false;

                                if ($matchAll === true) {
                                    continue 2;
                                }
                            }
                        } else {
                            $match = true;

                            if ($matchAll === false) {
                                break;
                            }
                        }
                    } else {
                        if (isset($memberships[$userGroup])) {
                            $match = true;

                            if ($matchAll === false) {
                                break;
                            }
                        } else {
                            $match = false;

                            if ($matchAll === true) {
                                continue 2;
                            }
                        }
                    }
                }

                if ($match === false) {
                    continue;
                }
            }

            if (isset($setting['group']) && !empty($setting['settings'])) {
                $setting['settings'] = $this->filterThemeSettings($setting['settings'], $memberships, $rolesMap);
            }

            $filtered[] = $setting;
        }

        return $filtered;
    }
}
