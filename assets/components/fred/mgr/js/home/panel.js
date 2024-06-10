fred.panel.Home = function (config) {
    config = config || {};
    config.permission = config.permission || {};

    this.state = Ext.state.Manager.getProvider();

    Ext.apply(config, {
        border: false,
        baseCls: 'modx-formpanel',
        cls: 'container',
        id: 'fred-home-panel',
        items: this.getItems(config)
    });
    fred.panel.Home.superclass.constructor.call(this, config);
};
Ext.extend(fred.panel.Home, MODx.Panel, {
    getHelpPath: function() {
        var defaultPath = '';

        var tabs = this.find('stateId', 'fred-tab-home');
        if (tabs.length !== 1) {
            return defaultPath;
        }

        tabs = tabs[0];

        var topLevelTab = tabs.getActiveTab();
        var childTab = topLevelTab.find('xtype', 'modx-vtabs');

        if (!topLevelTab.helpPath && (childTab.length === 1)) {

            return childTab[0].getActiveTab().helpPath || defaultPath;
        } else {
            return topLevelTab.helpPath || defaultPath;
        }
    },

    getItems: function(config) {
        return [
            {
                html: '<h2>' + _('fred.home.page_title') + '</h2>',
                border: false,
                cls: 'modx-page-header'
            },
            {
                xtype: 'modx-tabs',
                stateful: true,
                stateId: 'fred-tab-home',
                stateEvents: ['tabchange'],
                getState: function () {
                    return {
                        activeItem: this.items.indexOf(this.getActiveTab())
                    };
                },
                defaults: {
                    border: false,
                    autoHeight: true
                },
                border: true,
                activeItem: 0,
                hideMode: 'offsets',
                items: this.getTopTabs(config)
            }
        ];
    },

    getTopTabs: function(config) {
        var output = [];

        var elementsTabItems = this.getElementsTab(config);
        if (elementsTabItems.length > 0) {
            output.push({
                title: _('fred.home.elements'),
                items: [
                    {
                        xtype: 'modx-vtabs',
                        deferredRender: true,
                        stateful: true,
                        stateId: 'fred-tab-home-elements',
                        stateEvents: ['tabchange'],
                        getState: function () {
                            return {
                                activeItem: this.items.indexOf(this.getActiveTab())
                            };
                        },
                        items: elementsTabItems
                    }
                ]
            });
        }

        var blueprintsTabItems = this.getBlueprintsTab(config);
        if (blueprintsTabItems.length > 0) {
            output.push({
                title: _('fred.home.blueprints'),
                items: [
                    {
                        xtype: 'modx-vtabs',
                        deferredRender: true,
                        stateful: true,
                        stateId: 'fred-tab-home-blueprints',
                        stateEvents: ['tabchange'],
                        getState: function () {
                            return {
                                activeItem: this.items.indexOf(this.getActiveTab())
                            };
                        },
                        items: blueprintsTabItems
                    }
                ]
            });
        }

        var themesTabItems = this.getThemesTab(config);
        if (themesTabItems.length > 0) {
            output.push({
                title: _('fred.home.themes'),
                items: [
                    {
                        xtype: 'modx-vtabs',
                        deferredRender: true,
                        stateful: true,
                        stateId: 'fred-tab-home-themes',
                        stateEvents: ['tabchange'],
                        getState: function () {
                            return {
                                activeItem: this.items.indexOf(this.getActiveTab())
                            };
                        },
                        items: themesTabItems
                    }
                ]
            });
        }

        if (config.permission.fred_media_sources) {
            output.push({
                title: _('fred.home.media_sources'),
                helpPath: 'themer/cmp/media_sources/',
                items: [
                    {
                        xtype: 'fred-grid-media-sources',
                        preventRender: true,
                        cls: 'main-wrapper'
                    }
                ]
            });
        }

        return output;
    },

    getElementsTab: function(config) {
        var output = [];

        if (config.permission.fred_elements) {
            output.push({
                title: _('fred.home.elements'),
                helpPath: 'themer/cmp/elements/',
                items: [
                    {
                        xtype: 'fred-grid-elements',
                        preventRender: true,
                        cls: 'main-wrapper',
                        permission: config.permission,
                        homePanel: this
                    }
                ]
            });
        }

        if (config.permission.fred_element_categories) {
            output.push({
                title: _('fred.home.element_categories'),
                helpPath: 'themer/cmp/element_categories/',
                items: [
                    {
                        xtype: 'fred-grid-element-categories',
                        preventRender: true,
                        cls: 'main-wrapper',
                        permission: config.permission,
                        homePanel: this
                    }
                ]
            });
        }

        if (config.permission.fred_element_option_sets) {
            output.push({
                title: _('fred.home.option_sets'),
                helpPath: 'themer/cmp/option_sets/',
                items: [
                    {
                        xtype: 'fred-grid-element-option-sets',
                        preventRender: true,
                        cls: 'main-wrapper',
                        permission: config.permission,
                        homePanel: this
                    }
                ]
            });
        }

        if (config.permission.fred_element_rtes) {
            output.push({
                title: _('fred.home.rte_configs'),
                helpPath: 'themer/cmp/rte_configs/',
                items: [
                    {
                        xtype: 'fred-grid-element-rte-configs',
                        preventRender: true,
                        cls: 'main-wrapper',
                        permission: config.permission,
                        homePanel: this
                    }
                ]
            });
        }

        if (config.permission.fred_element_rebuild) {
            output.push({
                title: _('fred.home.rebuild'),
                helpPath: 'themer/cmp/rebuild/',
                items: [
                    {
                        cls: 'main-wrapper',
                        items: [
                            {
                                html: '<p>' + _('fred.rebuild.rebuild_desc') + '</p><br>'
                            },
                            {
                                xtype: 'button',
                                text: _('fred.rebuild.rebuild'),
                                handler: function() {
                                    var topic = '/fred/mgr/generate/refresh/';

                                    var console = MODx.load({
                                        xtype: 'modx-console',
                                        register: 'mgr',
                                        topic: topic,
                                        show_filename: 0
                                    });

                                    console.show(Ext.getBody());

                                    MODx.Ajax.request({
                                        url: fred.config.connectorUrl,
                                        params: {
                                            action: 'Fred\\Processors\\Generate\\Refresh',
                                            register: 'mgr',
                                            topic: topic
                                        },
                                        listeners: {
                                            success: {
                                                fn: function() {
                                                    console.fireEvent('complete');
                                                    console = null
                                                },
                                                scope:this
                                            }
                                        }
                                    });
                                }
                            }
                        ]
                    }
                ]
            });
        }

        return output;
    },

    getBlueprintsTab: function(config) {
        var output = [];

        if (config.permission.fred_blueprints) {
            output.push({
                title: _('fred.home.blueprints'),
                helpPath: 'themer/cmp/blueprints/',
                items: [
                    {
                        xtype: 'fred-grid-blueprints',
                        preventRender: true,
                        cls: 'main-wrapper',
                        permission: config.permission,
                        homePanel: this
                    }
                ]
            });
        }

        if (config.permission.fred_blueprint_categories) {
            output.push({
                title: _('fred.home.blueprint_categories'),
                helpPath: 'themer/cmp/blueprint_categories/',
                items: [
                    {
                        xtype: 'fred-grid-blueprint-categories',
                        preventRender: true,
                        cls: 'main-wrapper',
                        permission: config.permission,
                        homePanel: this
                    }
                ]
            });
        }

        return output;
    },

    getThemesTab: function(config) {
        var output = [];

        if (config.permission.fred_themes) {
            output.push({
                title: _('fred.home.themes'),
                helpPath: 'themer/cmp/themes/',
                items: [
                    {
                        xtype: 'fred-grid-themes',
                        preventRender: true,
                        cls: 'main-wrapper',
                        permission: config.permission,
                        homePanel: this
                    }
                ]
            });
        }

        if (config.permission.fred_themed_templates) {
            output.push({
                title: _('fred.home.themed_templates'),
                helpPath: 'themer/cmp/themed_templates/',
                items: [
                    {
                        xtype: 'fred-grid-themed-templates',
                        preventRender: true,
                        cls: 'main-wrapper',
                        permission: config.permission,
                        homePanel: this
                    }
                ]
            });
        }

        return output;
    }
});
Ext.reg('fred-panel-home', fred.panel.Home);
