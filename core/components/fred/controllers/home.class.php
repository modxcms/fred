<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

require_once dirname(dirname(__FILE__)) . '/index.class.php';

/**
 * @package fred
 * @subpackage controllers
 */
class FredHomeManagerController extends FredBaseManagerController
{
    protected $permissions = [];

    public function process(array $scriptProperties = array())
    {
        $this->loadPermissions();
    }

    public function getPageTitle()
    {
        return $this->modx->lexicon('fred.menu.fred');
    }

    public function loadCustomCssJs()
    {
        $this->addJavascript($this->fred->getOption('jsUrl') . 'utils/utils.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'utils/griddraganddrop.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'utils/combos.js');

        if ($this->permissions['fred_media_sources']) {
            $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/media_sources.grid.js');
        }

        $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/themed_template.window.js');

        if ($this->permissions['fred_themed_templates']) {
            $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/themed_templates.grid.js');
        }

        $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/theme.window.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/dependencies.grid.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/theme_build_media_sources.grid.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/theme_build_media_sources.window.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/theme_build_resolvers.grid.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/theme_build_resolvers.window.js');

        if ($this->permissions['fred_themes']) {
            $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/themes.grid.js');
        }

        $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/blueprint_category.window.js');

        if ($this->permissions['fred_blueprint_categories']) {
            $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/blueprint_categories.grid.js');
        }

        $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/blueprint.window.js');

        if ($this->permissions['fred_blueprints']) {
            $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/blueprints.grid.js');
        }

        $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/element_rte_config.window.js');

        if ($this->permissions['fred_element_rtes']) {
            $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/element_rte_configs.grid.js');
        }

        $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/element_option_set.window.js');

        if ($this->permissions['fred_element_option_sets']) {
            $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/element_option_sets.grid.js');
        }

        $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/element_category.window.js');

        if ($this->permissions['fred_element_categories']) {
            $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/element_categories.grid.js');
        }
        $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/element.window.js');

        if ($this->permissions['fred_elements']) {
            $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/elements.grid.js');
        }

        $this->addJavascript($this->fred->getOption('jsUrl') . 'home/panel.js');
        $this->addLastJavascript($this->fred->getOption('jsUrl') . 'home/page.js');

        $this->addHtml('
        <script type="text/javascript">
            Ext.onReady(function() {
                MODx.load({ 
                    xtype: "fred-page-home",
                    permission: ' . json_encode($this->permissions) . '
                });
            });
        </script>
        ');
    }

    public function getTemplateFile()
    {
        return $this->fred->getOption('templatesPath') . 'home.tpl';
    }

    protected function loadPermissions()
    {
        $this->permissions = [
            'fred_elements' => (int)$this->modx->hasPermission('fred_elements'),
            'fred_blueprints' => (int)$this->modx->hasPermission('fred_blueprints'),
            'fred_blueprint_categories' => (int)$this->modx->hasPermission('fred_blueprint_categories'),
            'fred_element_categories' => (int)$this->modx->hasPermission('fred_element_categories'),
            'fred_element_option_sets' => (int)$this->modx->hasPermission('fred_element_option_sets'),
            'fred_element_rtes' => (int)$this->modx->hasPermission('fred_element_rtes'),
            'fred_element_rebuild' => (int)$this->modx->hasPermission('fred_element_rebuild'),
            'fred_themes' => (int)$this->modx->hasPermission('fred_themes'),
            'fred_themed_templates' => (int)$this->modx->hasPermission('fred_themed_templates'),
            'fred_media_sources' => (int)$this->modx->hasPermission('fred_media_sources'),
            'fred_element_delete' => (int)$this->modx->hasPermission('fred_element_delete'),
            'fred_element_save' => (int)$this->modx->hasPermission('fred_element_save'),
            'fred_element_category_save' => (int)$this->modx->hasPermission('fred_element_category_save'),
            'fred_element_category_delete' => (int)$this->modx->hasPermission('fred_element_category_delete'),
            'fred_element_option_sets_save' => (int)$this->modx->hasPermission('fred_element_option_sets_save'),
            'fred_element_option_sets_delete' => (int)$this->modx->hasPermission('fred_element_option_sets_delete'),
            'fred_element_rte_config_save' => (int)$this->modx->hasPermission('fred_element_rte_config_save'),
            'fred_element_rte_config_delete' => (int)$this->modx->hasPermission('fred_element_rte_config_delete'),
            'fred_blueprint_categories_save' => (int)$this->modx->hasPermission('fred_blueprint_categories_save'),
            'fred_blueprint_categories_create_public' => (int)$this->modx->hasPermission('fred_blueprint_categories_create_public'),
            'fred_blueprint_categories_delete' => (int)$this->modx->hasPermission('fred_blueprint_categories_delete'),
            'fred_themes_save' => (int)$this->modx->hasPermission('fred_themes_save'),
            'fred_themes_build' => (int)$this->modx->hasPermission('fred_themes_build'),
            'fred_themes_delete' => (int)$this->modx->hasPermission('fred_themes_delete'),
            'fred_themed_templates_save' => (int)$this->modx->hasPermission('fred_themed_templates_save'),
            'fred_themed_templates_delete' => (int)$this->modx->hasPermission('fred_themed_templates_delete'),
            'fred_blueprints_save' => (int)$this->modx->hasPermission('fred_blueprints_save'),
            'fred_blueprints_create_public' => (int)$this->modx->hasPermission('fred_blueprints_create_public'),
            'fred_blueprints_delete' => (int)$this->modx->hasPermission('fred_blueprints_delete'),
        ];
    }
}
