<?php

namespace Fred\v2\Processors\Themes;

/**
 * @package fred
 * @subpackage processors
 */

class Build extends \modObjectProcessor
{
    public $classKey = 'FredTheme';
    public $languageTopics = ['fred:default'];
    public $objectType = 'fred.theme';

    /** @var \Fred */
    protected $fred;

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_themes_build')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }

    public function process()
    {
        $corePath = $this->modx->getOption('fred.core_path', null, $this->modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');
        $this->fred = $this->modx->getService(
            'fred',
            'Fred',
            $corePath . 'model/fred/',
            [
                'core_path' => $corePath
            ]
        );

        $name = $this->getProperty('name');
        $version = $this->getProperty('version', '1.0.0');
        $release = $this->getProperty('release', 'pl');
        $theme = $this->getProperty('id');

        $changelog = $this->getProperty('docs_changelog');
        $readme = $this->getProperty('docs_readme');
        $license = $this->getProperty('docs_license');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.build_ns_name'));
            return $this->failure();
        }

        if (!preg_match('/^[a-z_]+$/', $name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.theme_name_invalid_format'));
            return $this->failure();
        }

        if (!preg_match('/^[0-9]+\.[0-9]+\.[0-9]+$/', $version)) {
            $this->addFieldError('version', $this->modx->lexicon('fred.err.themes_version_number_format'));
            return $this->failure();
        }

        if (!preg_match('/^(pl|beta|alpha)[0-9]*$/', $release)) {
            $this->addFieldError('release', $this->modx->lexicon('fred.err.themes_release_format'));
            return $this->failure();
        }

        if (empty($theme)) {
            return $this->failure($this->modx->lexicon('fred.err.build_ns_theme'));
        }

        if (empty($changelog)) {
            $this->addFieldError('docs_changelog', $this->modx->lexicon('fred.err.theme_docs_changelog_ns'));
            return $this->failure();
        }

        if (empty($readme)) {
            $this->addFieldError('docs_readme', $this->modx->lexicon('fred.err.theme_docs_readme_ns'));
            return $this->failure();
        }

        if (empty($license)) {
            $this->addFieldError('docs_license', $this->modx->lexicon('fred.err.theme_docs_license_ns'));
            return $this->failure();
        }

        $extractTpl = $this->getProperty('extract_tpl', '');
        if (!empty($extractTpl)) {
            $extractTpl = json_decode($extractTpl, true);

            if (!is_array($extractTpl)) {
                $this->addFieldError('extract_tpl', $this->modx->lexicon('fred.err.themes_extract_tpl_parse_error'));
                return $this->failure();
            }
        }

        $built = $this->build($name, $version, $release, $theme, $extractTpl);

        if ($built !== true) {
            if ($built === false) {
                $built = $this->modx->lexicon('fred.err.build_failed');
            }

            return $this->failure($built);
        }

        return $this->success();
    }

    private function build($name, $version, $release, $themeId, $extractTpl)
    {
        $buildConfig = [
            'name' => $name,
            'version' => $version,
            'release' => $release,
            'extract_tpl' => $extractTpl,
            'dependencies' => [],
            'mediaSources' => [],
            'resolvers' => [],
            'folders' => [],
        ];
        $this->modx->loadClass('transport.modPackageBuilder', '', false, true);
        $builder = new \modPackageBuilder($this->modx);
        $builder->createPackage($name, $version, $release);

        $packagesToLoad = [];

        if (!empty($extractTpl['packages'])) {
            foreach ($extractTpl['packages'] as $package) {
                if (empty($package['name'])) {
                    return $this->modx->lexicon('fred.err.themes_extract_tpl_package_name');
                }

                if (empty($package['class'])) {
                    return $this->modx->lexicon('fred.err.themes_extract_tpl_package_class');
                }

                $packagesToLoad[] = $package;

                $componentName = empty($package['componentName']) ? $package['name'] : $package['componentName'];
                $modelName = empty($package['modelName']) ? $package['name'] : $package['modelName'];
                $settingPrefix = empty($package['settingPrefix']) ? $package['name'] : $package['settingPrefix'];
                $service = $this->modx->getService($package['name'], $package['class'], $this->modx->getOption($settingPrefix . '.core_path', null, $this->modx->getOption('core_path') . 'components/' . $componentName . '/') . 'model/' . $modelName . '/', []);

                if (!($service instanceof $package['class'])) {
                    return $this->modx->lexicon('fred.err.themes_extract_tpl_package_load', ['name' => $package['name']]);
                }
            }
        }

        $vehicle = $builder->createVehicle([
            "source" => $this->fred->getOption('buildHelpers') . 'get_fred.resolver.php'
        ], [
            "vehicle_class" => 'xPDOScriptVehicle',
            \xPDOTransport::ABORT_INSTALL_ON_VEHICLE_FAIL => true
        ]);
        $vehicle->validate('php', [
            'source' => $this->fred->getOption('buildHelpers') . 'install.validator.php',
            'packages' => $packagesToLoad
        ]);
        $builder->putVehicle($vehicle);

        /** @var \FredTheme $theme */
        $theme = $this->modx->getObject('FredTheme', ['id' => $themeId]);

        $themeNamespace = $theme->namespace;
        if (strpos($themeNamespace, '.') === false) {
            $vehicle = $builder->createVehicle(
                [
                    "source"       => $this->fred->getOption('buildHelpers') . 'fix_namespace.resolver.php',
                    "oldNamespace" => $theme->settingsPrefix,
                    "newNamespace" => $theme->namespace
                ],
                [
                    "vehicle_class" => 'xPDOScriptVehicle'
                ]
            );
            $vehicle->validate(
                'php',
                [
                    'source' => $this->fred->getOption('buildHelpers') . 'halt.validator.php'
                ]
            );
            $builder->putVehicle($vehicle);
        }

        $theme->set('config', []);

        $assetsPath = rtrim($this->modx->getOption('assets_path'), '/');

        $themesFolder = 'themes/';
        $themeFolder = $themesFolder . $theme->get('theme_folder');
        $themeFolderPath = $assetsPath . '/' . $themeFolder . '/';

        if (is_dir($themeFolderPath) && is_readable($themeFolderPath)) {
            $vehicle = $builder->createVehicle([
                "in" => $themeFolderPath,
                "notPath" => [
                    "/^_data/"
                ],
                "target" => "return MODX_ASSETS_PATH . '{$themeFolder}';"
            ], [
                "vehicle_class" => 'FredFileVehicle'
            ]);
            $vehicle->validate('php', [
                'source' => $this->fred->getOption('buildHelpers') . 'halt.validator.php'
            ]);
            $builder->putVehicle($vehicle);
        }

        /** @var \FredElementCategory[] $elementCategories */
        $elementCategories = $theme->getMany('ElementCategories');

        /** @var \FredBlueprintCategory[] $blueprintCategories */
        $blueprintCategories = $theme->getMany('BlueprintCategories', ['public' => true]);

        $theme->getMany('RTEConfigs');

        /** @var \FredThemedTemplate[] $themedTemplates */
        $themedTemplates = $theme->getMany('Templates');

        /** @var \FredElementOptionSet[] $optionSets */
        $optionSets = $theme->getMany('OptionSets');
        $optionSetsMap = [];

        if (!empty($optionSets)) {
            foreach ($optionSets as $optionSet) {
                $optionSetsMap[$optionSet->get('id')] = $optionSet->get('name');
            }
        }

        $elementOptionSetMap = [];
        $installedTemplates = [];
        $installedTVs = [];
        $rootCategories = [];

        if (!empty($elementCategories)) {
            foreach ($elementCategories as $elementCategory) {
                /** @var \FredElement[] $elements */
                $elements = $elementCategory->getMany('Elements');

                if (!empty($elements)) {
                    foreach ($elements as $element) {
                        $elementOptionSet = $element->get('option_set');
                        if (!empty($elementOptionSet)) {
                            if (isset($optionSetsMap[$elementOptionSet])) {
                                $elementOptionSetMap[$element->get('uuid')] = $optionSetsMap[$elementOptionSet];
                            }
                        }
                    }
                }
            }
        }

        if (!empty($blueprintCategories)) {
            foreach ($blueprintCategories as $blueprintCategory) {
                $blueprintCategory->set('createdBy', 0);

                /** @var \FredBlueprint[] $blueprints */
                $blueprints = $blueprintCategory->getMany('Blueprints', ['public' => true]);

                foreach ($blueprints as $blueprint) {
                    $blueprint->set('createdBy', 0);
                }
            }
        }

        if (!empty($themedTemplates)) {
            foreach ($themedTemplates as $themedTemplate) {
                /** @var \modTemplate $template */
                $template = $themedTemplate->getOne('Template');
                if ($template) {
                    $templateName = $template->get('templatename');
                    $installedTemplates[] = $templateName;

                    $templateCategory = $template->getOne('Category');
                    if ($templateCategory) {
                        $templateRootCategory = $templateCategory->get('category');
                        $templateParentCategory = $templateCategory->getOne('Parent');
                        while ($templateParentCategory) {
                            $templateRootCategory = $templateParentCategory->get('category');
                            $templateParentCategory = $templateParentCategory->getOne('Parent');
                        }

                        $rootCategories[] = $templateRootCategory;
                    }

                    /** @var \modTemplateVarTemplate[] $templateVarTemplates */
                    $templateVarTemplates = $template->getMany('TemplateVarTemplates');

                    if (is_array($templateVarTemplates)) {
                        foreach ($templateVarTemplates as $templateVarTemplate) {
                            /** @var \modTemplateVar $tv */
                            $tv = $templateVarTemplate->getOne('TemplateVar');
                            if ($tv) {
                                $installedTVs[] = $tv->get('name');

                                $category = $tv->getOne('Category');
                                if ($category) {
                                    $rootCategory = $category->get('category');
                                    $parent = $category->getOne('Parent');
                                    while ($parent) {
                                        $rootCategory = $parent->get('category');
                                        $parent = $parent->getOne('Parent');
                                    }

                                    $rootCategories[] = $rootCategory;
                                }
                            }
                        }
                    }
                }
            }
        }

        $categories = $this->getProperty('categories');
        if (!is_array($categories)) {
            $categories = [];
        }
        $buildConfig['categories'] = $categories;

        $categoryVehicles = [];
        foreach ($categories as $category) {
            /** @var \modCategory $categoryObject */
            $categoryObject = $this->modx->getObject('modCategory', ['category' => $category]);
            if ($categoryObject) {
                $this->loadCategory($categoryObject, $installedTemplates, $installedTVs, $rootCategories);

                $categoryVehicle = $builder->createVehicle($categoryObject, [
                    \xPDOTransport::PRESERVE_KEYS => false,
                    \xPDOTransport::UPDATE_OBJECT => true,
                    \xPDOTransport::UNIQUE_KEY => 'category',
                    \xPDOTransport::RELATED_OBJECTS => true,
                    \xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                        'Children' => [
                            \xPDOTransport::PRESERVE_KEYS => false,
                            \xPDOTransport::UPDATE_OBJECT => true,
                            \xPDOTransport::UNIQUE_KEY => ['parent','category'],
                        ],
                        'Snippets' => [
                            \xPDOTransport::PRESERVE_KEYS => false,
                            \xPDOTransport::UPDATE_OBJECT => true,
                            \xPDOTransport::UNIQUE_KEY => 'name',
                        ],
                        'Chunks' => [
                            \xPDOTransport::PRESERVE_KEYS => false,
                            \xPDOTransport::UPDATE_OBJECT => true,
                            \xPDOTransport::UNIQUE_KEY => 'name',
                        ],
                        'Plugins' => [
                            \xPDOTransport::UNIQUE_KEY => 'name',
                            \xPDOTransport::PRESERVE_KEYS => false,
                            \xPDOTransport::UPDATE_OBJECT => true,
                            \xPDOTransport::RELATED_OBJECTS => true,
                            \xPDOTransport::RELATED_OBJECT_ATTRIBUTES =>  [
                                'PluginEvents' => [
                                    \xPDOTransport::PRESERVE_KEYS => true,
                                    \xPDOTransport::UPDATE_OBJECT => false,
                                    \xPDOTransport::UNIQUE_KEY => ['pluginid','event'],
                                ],
                            ],
                        ],
                        'Templates' => [
                            \xPDOTransport::PRESERVE_KEYS => false,
                            \xPDOTransport::UPDATE_OBJECT => true,
                            \xPDOTransport::UNIQUE_KEY => 'templatename',
                            \xPDOTransport::RELATED_OBJECTS => true,
                            \xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                                'TemplateVarTemplates' => [
                                    \xPDOTransport::PRESERVE_KEYS => false,
                                    \xPDOTransport::UPDATE_OBJECT => true,
                                    \xPDOTransport::UNIQUE_KEY => ['tmplvarid', 'templateid'],
                                    \xPDOTransport::RELATED_OBJECTS => true,
                                    \xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                                        'TemplateVar' => [
                                            \xPDOTransport::PRESERVE_KEYS => false,
                                            \xPDOTransport::UPDATE_OBJECT => true,
                                            \xPDOTransport::UNIQUE_KEY => 'name',
                                            \xPDOTransport::RELATED_OBJECTS => true,
                                            \xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                                                'Category' => [
                                                    \xPDOTransport::PRESERVE_KEYS => false,
                                                    \xPDOTransport::UPDATE_OBJECT => true,
                                                    \xPDOTransport::UNIQUE_KEY => 'category',
                                                    \xPDOTransport::RELATED_OBJECTS => true,
                                                    \xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                                                        'Parent' => [
                                                            \xPDOTransport::PRESERVE_KEYS => false,
                                                            \xPDOTransport::UPDATE_OBJECT => true,
                                                            \xPDOTransport::UNIQUE_KEY => ['parent','category'],
                                                        ]
                                                    ]
                                                ]
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]);

                $categoryVehicle->validate('php', [
                    'source' => $this->fred->getOption('buildHelpers') . 'halt.validator.php'
                ]);

                $categoryVehicles[] = $categoryVehicle;
            }
        }

        $rootCategories = array_merge($rootCategories, $categories);
        $rootCategories = array_keys(array_flip($rootCategories));

        $vehicle = $builder->createVehicle([
            "source" => $this->fred->getOption('buildHelpers') . 'uninstall_categories.resolver.php',
            "rootCategories" => $rootCategories
        ], [
            "vehicle_class" => 'xPDOScriptVehicle',
        ]);
        $vehicle->validate('php', [
            'source' => $this->fred->getOption('buildHelpers') . 'halt.validator.php'
        ]);
        $builder->putVehicle($vehicle);

        $vehicle = $builder->createVehicle($theme, [
            \xPDOTransport::UNIQUE_KEY => 'uuid',
            \xPDOTransport::UPDATE_OBJECT => true,
            \xPDOTransport::PRESERVE_KEYS => false,
            \xPDOTransport::RELATED_OBJECTS => true,
            \xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                'ElementCategories' => [
                    \xPDOTransport::PRESERVE_KEYS => false,
                    \xPDOTransport::UPDATE_OBJECT => true,
                    \xPDOTransport::UNIQUE_KEY => 'uuid',
                    \xPDOTransport::RELATED_OBJECTS => true,
                    \xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                        'Elements' => [
                            \xPDOTransport::PRESERVE_KEYS => false,
                            \xPDOTransport::UPDATE_OBJECT => true,
                            \xPDOTransport::UNIQUE_KEY => 'uuid',
                            \xPDOTransport::RELATED_OBJECTS => false,
                        ]
                    ]
                ],
                'BlueprintCategories' => [
                    \xPDOTransport::PRESERVE_KEYS => false,
                    \xPDOTransport::UPDATE_OBJECT => true,
                    \xPDOTransport::UNIQUE_KEY => 'uuid',
                    \xPDOTransport::RELATED_OBJECTS => true,
                    \xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                        'Blueprints' => [
                            \xPDOTransport::PRESERVE_KEYS => false,
                            \xPDOTransport::UPDATE_OBJECT => true,
                            \xPDOTransport::UNIQUE_KEY => 'uuid'
                        ]
                    ]
                ],
                'RTEConfigs' => [
                    \xPDOTransport::PRESERVE_KEYS => false,
                    \xPDOTransport::UPDATE_OBJECT => true,
                    \xPDOTransport::UNIQUE_KEY => ['name', 'theme'],
                ],
                'OptionSets' => [
                    \xPDOTransport::PRESERVE_KEYS => false,
                    \xPDOTransport::UPDATE_OBJECT => true,
                    \xPDOTransport::UNIQUE_KEY => ['name', 'theme'],
                ],
                'Templates' => [
                    \xPDOTransport::PRESERVE_KEYS => false,
                    \xPDOTransport::UPDATE_OBJECT => true,
                    \xPDOTransport::UNIQUE_KEY => ['template', 'theme'],
                    \xPDOTransport::RELATED_OBJECTS => true,
                    \xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                        'Template' => [
                            \xPDOTransport::PRESERVE_KEYS => false,
                            \xPDOTransport::UPDATE_OBJECT => true,
                            \xPDOTransport::UNIQUE_KEY => 'templatename',
                            \xPDOTransport::RELATED_OBJECTS => true,
                            \xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                                'TemplateVarTemplates' => [
                                    \xPDOTransport::PRESERVE_KEYS => false,
                                    \xPDOTransport::UPDATE_OBJECT => true,
                                    \xPDOTransport::UNIQUE_KEY => ['tmplvarid', 'templateid'],
                                    \xPDOTransport::RELATED_OBJECTS => true,
                                    \xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                                        'TemplateVar' => [
                                            \xPDOTransport::PRESERVE_KEYS => false,
                                            \xPDOTransport::UPDATE_OBJECT => true,
                                            \xPDOTransport::UNIQUE_KEY => 'name',
                                            \xPDOTransport::RELATED_OBJECTS => true,
                                            \xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                                                'Category' => [
                                                    \xPDOTransport::PRESERVE_KEYS => false,
                                                    \xPDOTransport::UPDATE_OBJECT => true,
                                                    \xPDOTransport::UNIQUE_KEY => 'category',
                                                    \xPDOTransport::RELATED_OBJECTS => true,
                                                    \xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                                                        'Parent' => [
                                                            \xPDOTransport::PRESERVE_KEYS => false,
                                                            \xPDOTransport::UPDATE_OBJECT => true,
                                                            \xPDOTransport::UNIQUE_KEY => ['parent','category'],
                                                        ]
                                                    ]
                                                ]
                                            ]
                                        ]
                                    ]
                                ],
                                'Category' => [
                                    \xPDOTransport::PRESERVE_KEYS => false,
                                    \xPDOTransport::UPDATE_OBJECT => true,
                                    \xPDOTransport::UNIQUE_KEY => 'category',
                                    \xPDOTransport::RELATED_OBJECTS => true,
                                    \xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                                        'Parent' => [
                                            \xPDOTransport::PRESERVE_KEYS => false,
                                            \xPDOTransport::UPDATE_OBJECT => true,
                                            \xPDOTransport::UNIQUE_KEY => ['parent','category'],
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ]);
        $vehicle->validate('php', [
            'source' => $this->fred->getOption('buildHelpers') . 'halt.validator.php'
        ]);
        $builder->putVehicle($vehicle);

        /** @var \modNamespace $namespace */
        $namespace = $this->modx->getObject('modNamespace', ['name' => $theme->get('namespace')]);
        if ($namespace) {
            $vehicle = $builder->createVehicle($namespace, [
                \xPDOTransport::UNIQUE_KEY => 'name',
                \xPDOTransport::UPDATE_OBJECT => false,
                \xPDOTransport::PRESERVE_KEYS => true
            ]);
            $vehicle->validate('php', [
                'source' => $this->fred->getOption('buildHelpers') . 'halt.validator.php'
            ]);
            $builder->putVehicle($vehicle);

            /** @var \modSystemSetting[] $settings */
            $settings = $this->modx->getIterator('modSystemSetting', [
                'namespace' => $namespace->name,
                'key:LIKE' => "{$theme->settingsPrefix}.%",
                'key:!=' => "{$theme->settingsPrefix}.theme_dir"
            ]);

            $settingAttributes = [
                \xPDOTransport::UNIQUE_KEY => 'key',
                \xPDOTransport::PRESERVE_KEYS => true,
                \xPDOTransport::UPDATE_OBJECT => false
            ];

            foreach ($settings as $setting) {
                $vehicle = $builder->createVehicle($setting, $settingAttributes);
                $vehicle->validate('php', [
                    'source' => $this->fred->getOption('buildHelpers') . 'halt.validator.php'
                ]);
                $builder->putVehicle($vehicle);
            }

            /** @var \modLexiconEntry[] $lexicons */
            $lexicons = $this->modx->getIterator('modLexiconEntry', [
                'namespace' => $namespace->name,
                'name:LIKE' => "setting_{$theme->settingsPrefix}.%",
                'name:!=' => "setting_{$theme->settingsPrefix}.theme_dir"
            ]);

            $lexiconsAttributes = [
                \xPDOTransport::UNIQUE_KEY => 'name',
                \xPDOTransport::PRESERVE_KEYS => true,
                \xPDOTransport::UPDATE_OBJECT => false
            ];

            foreach ($lexicons as $lexicon) {
                $vehicle = $builder->createVehicle($lexicon, $lexiconsAttributes);
                $vehicle->validate('php', [
                    'source' => $this->fred->getOption('buildHelpers') . 'halt.validator.php'
                ]);
                $builder->putVehicle($vehicle);
            }
        }

        $vehicle = $builder->createVehicle([
            "source" => $this->fred->getOption('buildHelpers') . 'link_element_option_set.resolver.php',
            "map" => $elementOptionSetMap
        ], [
            "vehicle_class" => 'xPDOScriptVehicle'
        ]);
        $vehicle->validate('php', [
            'source' => $this->fred->getOption('buildHelpers') . 'halt.validator.php'
        ]);
        $builder->putVehicle($vehicle);


        $mediaSources = json_decode($this->getProperty('mediaSources'), true);
        if (is_array($mediaSources)) {
            $buildConfig['mediaSources'] = [];
            foreach ($mediaSources as $mediaSource) {
                if (empty($mediaSource['id'])) {
                    continue;
                }

                $mediaSourceId = (int)$mediaSource['id'];
                if (empty($mediaSourceId)) {
                    continue;
                }

                $mediaSourceObject = $this->modx->getObject('modMediaSource', ['id' => $mediaSourceId]);
                if (!$mediaSourceObject) {
                    continue;
                }

                $mediaSourceVehicle = $builder->createVehicle($mediaSourceObject, [
                    \xPDOTransport::PRESERVE_KEYS => false,
                    \xPDOTransport::UPDATE_OBJECT => true,
                    \xPDOTransport::UNIQUE_KEY => 'name',
                    \xPDOTransport::UNINSTALL_OBJECT => false,
                ]);

                $mediaSourceVehicle->validate('php', [
                    'source' => $this->fred->getOption('buildHelpers') . 'halt.validator.php'
                ]);

                $builder->putVehicle($mediaSourceVehicle);

                $buildConfig['mediaSources'][] = $mediaSourceId;
            }
        }

        foreach ($categoryVehicles as $cV) {
            $builder->putVehicle($cV);
        }

        if (!empty($extractTpl['vehicles'])) {
            foreach ($extractTpl['vehicles'] as $vehicleData) {
                $graph = isset($vehicleData['object']['graph']) && is_array($vehicleData['object']['graph']) ? $vehicleData['object']['graph'] : [];
                $graphCriteria = isset($vehicleData['object']['graphCriteria']) && is_array($vehicleData['object']['graphCriteria']) ? $vehicleData['object']['graphCriteria'] : null;
                $criteria = !empty($vehicleData['object']['criteria']) ? ((array)$vehicleData['object']['criteria']) : [];

                /** @var \xPDOObject[] $iterator */
                $iterator = $this->modx->getIterator($vehicleData['object']['class'], $criteria, false);
                foreach ($iterator as $object) {
                    $object->getGraph($graph, $graphCriteria, false);

                    $vehicle = $builder->createVehicle($object, $vehicleData['attributes']);

                    $vehicle->validate('php', [
                        'source' => $this->fred->getOption('buildHelpers') . 'halt.validator.php'
                    ]);

                    $builder->putVehicle($vehicle);
                }
            }
        }

        $installedTemplates = array_keys(array_flip($installedTemplates));
        $installedTVs = array_keys(array_flip($installedTVs));

        $vehicle = $builder->createVehicle([
            "source" => $this->fred->getOption('buildHelpers') . 'uninstall_templates_tvs.resolver.php',
            "installedTemplates" => $installedTemplates,
            "installedTVs" => $installedTVs,
        ], [
            "vehicle_class" => 'xPDOScriptVehicle',
        ]);
        $vehicle->validate('php', [
            'source' => $this->fred->getOption('buildHelpers') . 'halt.validator.php'
        ]);
        $builder->putVehicle($vehicle);

        $vehicle = $builder->createVehicle([
            "source" => $this->fred->getOption('buildHelpers') . 'get_fred_uninstall.resolver.php'
        ], [
            "vehicle_class" => 'xPDOScriptVehicle'
        ]);

        $vehicle->validate('php', [
            'source' => $this->fred->getOption('buildHelpers') . 'uninstall.validator.php',
            'packages' => $packagesToLoad
        ]);

        $resolvers = json_decode($this->getProperty('resolvers'), true);
        if (is_array($resolvers)) {
            $buildConfig['resolvers'] = [];
            foreach ($resolvers as $resolver) {
                $vehicle->resolve('php', [
                    'source' => $resolver['file']
                ]);

                $buildConfig['resolvers'][] = ['file' => $resolver['file']];
            }
        }

        $builder->putVehicle($vehicle);

        $requires = [];
        $fredFound = false;
        $dependencies = json_decode($this->getProperty('dependencies'), true);
        if (is_array($dependencies)) {
            $buildConfig['dependencies'] = $dependencies;
            foreach ($dependencies as $dependency) {
                $name = trim($dependency['name']);
                if (empty($name)) {
                    continue;
                }

                $depVersion = trim($dependency['version']);
                if (empty($depVersion)) {
                    $depVersion = '*';
                }

                if (strtolower($name) === 'fred') {
                    $fredFound = true;
                }

                $requires[$name] = $depVersion;
            }
        }

        if ($fredFound === false) {
            $requires['fred'] = '*';
        }

        $changelog = $this->getProperty('docs_changelog');
        $readme = $this->getProperty('docs_readme');
        $license = $this->getProperty('docs_license');

        $buildAttributes = [
            'requires' => $requires,
            'changelog' => $changelog,
            'readme' => $readme,
            'license' => $license
        ];

        $buildConfig['docs_changelog'] = $changelog;
        $buildConfig['docs_readme'] = $readme;
        $buildConfig['docs_license'] = $license;

        $builder->setPackageAttributes($buildAttributes);

        if ($builder->pack()) {
            $theme->set('config', $buildConfig);
            return $theme->save();
        }

        return false;
    }

    /**
     * @param \modCategory $category
     */
    private function loadCategory(&$category, &$installedTemplates, &$installedTVs, &$rootCategories)
    {
        $category->getMany('Chunks');
        $category->getMany('Snippets');

        /** @var \modPlugin[] $plugins */
        $plugins = $category->getMany('Plugins');
        foreach ($plugins as $plugin) {
            $plugin->getMany('PluginEvents');
        }

        /** @var \modTemplate[] $templates */
        $templates = $category->getMany('Templates', ['templatename:NOT IN' => $installedTemplates]);
        foreach ($templates as $template) {
            $templateName = $template->get('templatename');
            $installedTemplates[] = $templateName;

            /** @var \modTemplateVarTemplate[] $templateVarTemplates */
            $templateVarTemplates = $template->getMany('TemplateVarTemplates');

            if (is_array($templateVarTemplates)) {
                foreach ($templateVarTemplates as $templateVarTemplate) {
                    /** @var \modTemplateVar $tv */
                    $tv = $templateVarTemplate->getOne('TemplateVar');
                    if ($tv) {
                        $cat = $tv->getOne('Category');
                        if ($cat) {
                            $rootCategory = $cat->get('category');
                            $parentCategory = $cat->getOne('Parent');
                            while ($parentCategory) {
                                $rootCategory = $parentCategory->get('category');
                                $parentCategory = $parentCategory->getOne('Parent');
                            }

                            $rootCategories[] = $rootCategory;
                        }

                        $installedTVs[] = $tv->get('name');
                    }
                }
            }
        }

        $childCategories = $category->getMany('Children');
        foreach ($childCategories as $childCategory) {
            $this->loadCategory($childCategory, $installedTemplates, $installedTVs, $rootCategories);
        }
    }
}
