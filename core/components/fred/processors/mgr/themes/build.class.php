<?php
/**
 * @package fred
 * @subpackage processors
 */

class FredThemeBuildProcessor extends modObjectProcessor
{
    public $classKey = 'FredTheme';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.theme';

    /** @var Fred */
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
        /** @var Fred $fred */
        $this->fred = $this->modx->getService(
            'fred',
            'Fred',
            $corePath . 'model/fred/',
            array(
                'core_path' => $corePath
            )
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
        
        $built = $this->build($name, $version, $release, $theme);
        
        if ($built !== true) {
            if ($built === false) {
                $built = $this->modx->lexicon('fred.err.build_failed');
            }
            
            return $this->failure($built);
        }

        return $this->success();
    }

    private function build($name, $version, $release, $themeId)
    {
        $buildConfig = [
            'name' => $name,
            'version' => $version,
            'release' => $release,
            'dependencies' => [],
            'folders' => [],
        ];
        
        $this->modx->loadClass('transport.modPackageBuilder', '', false, true);
        $builder = new modPackageBuilder($this->modx);
        $builder->createPackage($name, $version, $release);

        $this->modx->loadClass('transport.xPDOScriptVehicle');

        $vehicle = $builder->createVehicle([
            "source" => $this->fred->getOption('buildHelpers') . 'get_fred.resolver.php'
        ], [
            "vehicle_class" => "xPDOScriptVehicle"
        ]);
        $builder->putVehicle($vehicle);

        /** @var FredTheme $theme */
        $theme = $this->modx->getObject('FredTheme', ['id' => $themeId]);

        $theme->set('config', []);

        $assetsPath = rtrim($this->modx->getOption('assets_path'), '/');

        $themesFolder = 'themes/';
        $themeFolder = $themesFolder . $theme->get('theme_folder');
        $themeFolderPath = $assetsPath . '/' . $themeFolder . '/';

        if (is_dir($themeFolderPath) && is_readable($themeFolderPath)) {
            $vehicle = $builder->createVehicle([
                "source" => $themeFolderPath,
                "target" => "return MODX_ASSETS_PATH . '{$themesFolder}';"
            ], [
                "vehicle_class" => "xPDOFileVehicle"
            ]);
            $vehicle->validate('php', [
                'source' => $this->fred->getOption('buildHelpers') . 'halt.validator.php'
            ]);
            $builder->putVehicle($vehicle);
        }
        
        /** @var FredElementCategory[] $elementCategories */
        $elementCategories = $theme->getMany('ElementCategories');
        
        /** @var FredBlueprintCategory[] $blueprintCategories */
        $blueprintCategories = $theme->getMany('BlueprintCategories', ['public' => true]);

        $theme->getMany('RTEConfigs');
        
        /** @var FredThemedTemplate[] $themedTemplates */
        $themedTemplates = $theme->getMany('Templates');
        
        /** @var FredElementOptionSet[] $optionSets */
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
                /** @var FredElement[] $elements */
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
                
                /** @var FredBlueprint[] $blueprints */
                $blueprints = $blueprintCategory->getMany('Blueprints', ['public' => true]);
                
                foreach ($blueprints as $blueprint) {
                    $blueprint->set('createdBy', 0);
                }
            }
        }
        
        if (!empty($themedTemplates)) {
            foreach ($themedTemplates as $themedTemplate) {
                /** @var modTemplate $template */
                $template = $themedTemplate->getOne('Template');
                if ($template) {
                    $templateName = $template->get('templatename');
                    $installedTemplates[] = $templateName;
                    
                    /** @var  modTemplateVarTemplate[] $templateVarTemplates */
                    $templateVarTemplates = $template->getMany('TemplateVarTemplates');
                    
                    if (is_array($templateVarTemplates)) {
                        foreach ($templateVarTemplates as $templateVarTemplate) {
                            /** @var modTemplateVar $tv */
                            $tv = $templateVarTemplate->getOne('TemplateVar');
                            if ($tv) {
                                $installedTVs[] = $tv->get('name');
                                
                                $category = $tv->getOne('Category');
                                if ($category) {
                                    $rootCategory = $category->get('category');
                                    $parent = $category->getOne('Parent');
                                    while($parent) {
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
        if (!is_array($categories)) $categories = [];
        $buildConfig['categories'] = $categories;

        $rootCategories = array_merge($rootCategories, $categories);
        $rootCategories = array_keys(array_flip($rootCategories));

        $vehicle = $builder->createVehicle([
            "source" => $this->fred->getOption('buildHelpers') . 'uninstall_categories.resolver.php',
            "rootCategories" => $rootCategories
        ], [
            "vehicle_class" => "xPDOScriptVehicle",
        ]);
        $vehicle->validate('php', [
            'source' => $this->fred->getOption('buildHelpers') . 'halt.validator.php'
        ]);
        $builder->putVehicle($vehicle);
        
        $vehicle = $builder->createVehicle($theme, [
            xPDOTransport::UNIQUE_KEY => 'uuid',
            xPDOTransport::UPDATE_OBJECT => true,
            xPDOTransport::PRESERVE_KEYS => false,
            xPDOTransport::RELATED_OBJECTS => true,
            xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                'ElementCategories' => [
                    xPDOTransport::PRESERVE_KEYS => false,
                    xPDOTransport::UPDATE_OBJECT => true,
                    xPDOTransport::UNIQUE_KEY => 'uuid',
                    xPDOTransport::RELATED_OBJECTS => true,
                    xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                        'Elements' => [
                            xPDOTransport::PRESERVE_KEYS => false,
                            xPDOTransport::UPDATE_OBJECT => true,
                            xPDOTransport::UNIQUE_KEY => 'uuid',
                            xPDOTransport::RELATED_OBJECTS => false,
                        ]
                    ]
                ],
                'BlueprintCategories' => [
                    xPDOTransport::PRESERVE_KEYS => false,
                    xPDOTransport::UPDATE_OBJECT => true,
                    xPDOTransport::UNIQUE_KEY => 'uuid',
                    xPDOTransport::RELATED_OBJECTS => true,
                    xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                        'Blueprints' => [
                            xPDOTransport::PRESERVE_KEYS => false,
                            xPDOTransport::UPDATE_OBJECT => true,
                            xPDOTransport::UNIQUE_KEY => 'uuid'
                        ]
                    ]
                ],
                'RTEConfigs' => [
                    xPDOTransport::PRESERVE_KEYS => false,
                    xPDOTransport::UPDATE_OBJECT => true,
                    xPDOTransport::UNIQUE_KEY => ['name', 'theme'],
                ],
                'OptionSets' => [
                    xPDOTransport::PRESERVE_KEYS => false,
                    xPDOTransport::UPDATE_OBJECT => true,
                    xPDOTransport::UNIQUE_KEY => ['name', 'theme'],
                ],
                'Templates' => [
                    xPDOTransport::PRESERVE_KEYS => false,
                    xPDOTransport::UPDATE_OBJECT => true,
                    xPDOTransport::UNIQUE_KEY => ['template', 'theme'],
                    xPDOTransport::RELATED_OBJECTS => true,
                    xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                        'Template' => [
                            xPDOTransport::PRESERVE_KEYS => false,
                            xPDOTransport::UPDATE_OBJECT => true,
                            xPDOTransport::UNIQUE_KEY => 'templatename',
                            xPDOTransport::RELATED_OBJECTS => true,
                            xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                                'TemplateVarTemplates' => [
                                    xPDOTransport::PRESERVE_KEYS => false,
                                    xPDOTransport::UPDATE_OBJECT => true,
                                    xPDOTransport::UNIQUE_KEY => ['tmplvarid', 'templateid'],
                                    xPDOTransport::RELATED_OBJECTS => true,
                                    xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                                        'TemplateVar' => [
                                            xPDOTransport::PRESERVE_KEYS => false,
                                            xPDOTransport::UPDATE_OBJECT => true,
                                            xPDOTransport::UNIQUE_KEY => 'name',       
                                            xPDOTransport::RELATED_OBJECTS => true,
                                            xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                                                'Category' => [
                                                    xPDOTransport::PRESERVE_KEYS => false,
                                                    xPDOTransport::UPDATE_OBJECT => true,
                                                    xPDOTransport::UNIQUE_KEY => 'category',
                                                    xPDOTransport::RELATED_OBJECTS => true,
                                                    xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                                                        'Parent' => [
                                                            xPDOTransport::PRESERVE_KEYS => false,
                                                            xPDOTransport::UPDATE_OBJECT => true,
                                                            xPDOTransport::UNIQUE_KEY => ['parent','category'],
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
                ]
            ]
        ]);
        $vehicle->validate('php', [
            'source' => $this->fred->getOption('buildHelpers') . 'halt.validator.php'
        ]);
        $builder->putVehicle($vehicle);

        $vehicle = $builder->createVehicle([
            "source" => $this->fred->getOption('buildHelpers') . 'link_element_option_set.resolver.php',
            "map" => $elementOptionSetMap
        ], [
            "vehicle_class" => "xPDOScriptVehicle"
        ]);
        $vehicle->validate('php', [
            'source' => $this->fred->getOption('buildHelpers') . 'halt.validator.php'
        ]);
        $builder->putVehicle($vehicle);

        foreach ($categories as $category) {
            /** @var modCategory $categoryObject */
            $categoryObject = $this->modx->getObject('modCategory', ['category' => $category]);
            if ($categoryObject) {
                $this->loadCategory($categoryObject);

                $categoryVehicle = $builder->createVehicle($categoryObject, [
                    xPDOTransport::PRESERVE_KEYS => false,
                    xPDOTransport::UPDATE_OBJECT => true,
                    xPDOTransport::UNIQUE_KEY => 'category',
                    xPDOTransport::RELATED_OBJECTS => true,
                    xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
                        'Children' => [
                            xPDOTransport::PRESERVE_KEYS => false,
                            xPDOTransport::UPDATE_OBJECT => true,
                            xPDOTransport::UNIQUE_KEY => ['parent','category'],
                        ],
                        'Snippets' => array(
                            xPDOTransport::PRESERVE_KEYS => false,
                            xPDOTransport::UPDATE_OBJECT => true,
                            xPDOTransport::UNIQUE_KEY => 'name',
                        ),
                        'Chunks' => array(
                            xPDOTransport::PRESERVE_KEYS => false,
                            xPDOTransport::UPDATE_OBJECT => true,
                            xPDOTransport::UNIQUE_KEY => 'name',
                        ),
                        'Plugins' => array(
                            xPDOTransport::UNIQUE_KEY => 'name',
                            xPDOTransport::PRESERVE_KEYS => false,
                            xPDOTransport::UPDATE_OBJECT => true,
                            xPDOTransport::RELATED_OBJECTS => true,
                            xPDOTransport::RELATED_OBJECT_ATTRIBUTES => array (
                                'PluginEvents' => array(
                                    xPDOTransport::PRESERVE_KEYS => true,
                                    xPDOTransport::UPDATE_OBJECT => false,
                                    xPDOTransport::UNIQUE_KEY => array('pluginid','event'),
                                ),
                            ),
                        )
                    ]
                ]);

                $categoryVehicle->validate('php', [
                    'source' => $this->fred->getOption('buildHelpers') . 'halt.validator.php'
                ]);
                
                $builder->putVehicle($categoryVehicle);
            }
        }

        $installedTemplates = array_keys(array_flip($installedTemplates));
        $installedTVs = array_keys(array_flip($installedTVs));
        
        $vehicle = $builder->createVehicle([
            "source" => $this->fred->getOption('buildHelpers') . 'uninstall_templates_tvs.resolver.php',
            "installedTemplates" => $installedTemplates,
            "installedTVs" => $installedTVs,
        ], [
            "vehicle_class" => "xPDOScriptVehicle",
        ]);
        $vehicle->validate('php', [
            'source' => $this->fred->getOption('buildHelpers') . 'uninstall.validator.php'
        ]);
        $builder->putVehicle($vehicle);

        $vehicle = $builder->createVehicle([
            "source" => $this->fred->getOption('buildHelpers') . 'get_fred_uninstall.resolver.php'
        ], [
            "vehicle_class" => "xPDOScriptVehicle"
        ]);
        $builder->putVehicle($vehicle);
        
        $requires = [];
        $fredFound = false;
        $dependencies = json_decode($this->getProperty('dependencies'), true);
        if (is_array($dependencies)) {
            $buildConfig['dependencies'] = $dependencies;
            foreach($dependencies as $dependency) {
                $name = trim($dependency['name']);
                if (empty($name)) continue;
                
                $depVersion = trim($dependency['version']);
                if (empty($depVersion)) $depVersion = '*';

                if (strtolower($name) === 'fred') $fredFound = true;
                
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
     * @param modCategory $category
     */
    private function loadCategory(&$category)
    {
        $category->getMany('Chunks');
        $category->getMany('Snippets');

        /** @var modPlugin[] $plugins */
        $plugins = $category->getMany('Plugins');
        foreach ($plugins as $plugin){
            $plugin->getMany('PluginEvents');
        }

        $childCategories = $category->getMany('Children');
        foreach ($childCategories as $childCategory) {
            $this->loadCategory($childCategory);
        }
    }
}

return 'FredThemeBuildProcessor';