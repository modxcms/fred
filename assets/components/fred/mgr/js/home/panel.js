fred.panel.Home = function (config) {
    config = config || {};
    Ext.apply(config, {
        border: false,
        baseCls: 'modx-formpanel',
        cls: 'container',
        items: [
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
                id: 'fred-test-panel',
                hideMode: 'offsets',
                items: [
                    {
                        title: _('fred.home.elements'),
                        items: [
                            {
                                xtype: 'fred-grid-elements',
                                preventRender: true,
                                cls: 'main-wrapper'
                            }
                        ]
                    },
                    {
                        title: _('fred.home.element_categories'),
                        items: [
                            {
                                xtype: 'fred-grid-element-categories',
                                preventRender: true,
                                cls: 'main-wrapper'
                            }
                        ]
                    },
                    {
                        title: _('fred.home.option_sets'),
                        items: [
                            {
                                xtype: 'fred-grid-element-option-sets',
                                preventRender: true,
                                cls: 'main-wrapper'
                            }
                        ]
                    },
                    {
                        title: _('fred.home.rte_configs'),
                        items: [
                            {
                                xtype: 'fred-grid-element-rte-configs',
                                preventRender: true,
                                cls: 'main-wrapper'
                            }
                        ]
                    },
                    {
                        title: _('fred.home.blueprints'),
                        items: [
                            {
                                xtype: 'fred-grid-blueprints',
                                preventRender: true,
                                cls: 'main-wrapper'
                            }
                        ]
                    },
                    {
                        title: _('fred.home.blueprint_categories'),
                        items: [
                            {
                                xtype: 'fred-grid-blueprint-categories',
                                preventRender: true,
                                cls: 'main-wrapper'
                            }
                        ]
                    },
                    {
                        title: _('fred.home.themes'),
                        items: [
                            {
                                xtype: 'fred-grid-themes',
                                preventRender: true,
                                cls: 'main-wrapper'
                            }
                        ]
                    },
                    {
                        title: _('fred.home.themed_templates'),
                        items: [
                            {
                                xtype: 'fred-grid-themed-templates',
                                preventRender: true,
                                cls: 'main-wrapper'
                            }
                        ]
                    }
                ]
            }
        ]
    });
    fred.panel.Home.superclass.constructor.call(this, config);
};
Ext.extend(fred.panel.Home, MODx.Panel);
Ext.reg('fred-panel-home', fred.panel.Home);