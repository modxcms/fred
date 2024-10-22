fred.panel.Theme = function (config) {
    config = config || {};

    config.id = config.id || 'fred-panel-theme';

    Ext.applyIf(config, {
        border: false,
        cls: 'container',
        baseCls: 'modx-formpanel',
        url: fred.config.connectorUrl,
        baseParams: {
            action: 'Fred\\Processors\\Themes\\Update'
        },
        useLoadingMask: true,
        items: this.getItems(config),
        listeners: {
            'setup': {
                fn: this.setup,
                scope: this
            },
            'success': {
                fn: this.success,
                scope: this
            }
        }
    });
    fred.panel.Theme.superclass.constructor.call(this, config);
};

Ext.extend(fred.panel.Theme, MODx.FormPanel, {
    setup: function () {
        if (this.config.isUpdate) {
            MODx.Ajax.request({
                url: this.config.url,
                params: {
                    action: 'Fred\\Processors\\Themes\\Get',
                    id: MODx.request.id
                },
                listeners: {
                    'success': {
                        fn: function (r) {
                            if (Array.isArray(r.object.settings) && r.object.settings.length === 0) {
                                r.object.settings = '';
                            } else {
                                if (typeof r.object.settings === 'object') {
                                    r.object.settings = JSON.stringify(r.object.settings, null, 2);
                                }
                            }

                            this.getForm().setValues(r.object);

                            this.fireEvent('ready', r.object);
                            MODx.fireEvent('ready');
                        },
                        scope: this
                    }
                }
            });
        } else {
            var theme = MODx.request.theme;
            if (theme) {
                this.getForm().setValues({theme: theme});
            }

            this.fireEvent('ready');
            MODx.fireEvent('ready');
        }
    },

    success: function (o, r) {
        if (this.config.isUpdate == false) {
            fred.loadPage('theme/update', {id: o.result.object.id});
        }
    },

    getItems: function (config) {
        return [
            MODx.util.getHeaderBreadCrumbs({
                html: ((config.isUpdate == true) ? _('fred.themes.update') : _('fred.themes.create')),
                xtype: "modx-header"
            }, [
                {
                    text: _('fred.home.page_title'),
                    href: '?a=home&namespace=fred',
                },
                {
                    text: _('fred.home.themes'),
                    href: null,
                }
            ]),
            {
                name: 'id',
                xtype: 'hidden'
            },
            this.getGeneralFields(config),
            {
                html: '<br />',
                bodyCssClass: 'transparent-background'
            },
            this.getColumnsGrid(config)
        ];
    },

    getGeneralFields: function (config) {
        return [
            {
                deferredRender: false,
                border: true,
                style: {
                    marginTop: '40px'
                },
                defaults: {
                    autoHeight: true,
                    layout: 'form',
                    labelWidth: 150,
                    bodyCssClass: 'main-wrapper',
                    layoutOnTabChange: true
                },
                items: [
                    {
                        layout: 'column',
                        border: false,
                        height: 100,
                        defaults: {
                            layout: 'form',
                            labelAlign: 'top',
                            labelSeparator: '',
                            anchor: '100%',
                            border: false
                        },
                        items: [
                            {
                                columnWidth: 0.7,
                                border: false,
                                defaults: {
                                    msgTarget: 'under'
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: _('fred.themes.name'),
                                        name: 'name',
                                        anchor: '100%',
                                        allowBlank: false
                                    },
                                    {
                                        xtype: 'textarea',
                                        fieldLabel: _('fred.themes.description'),
                                        name: 'description',
                                        anchor: '100%',
                                        height: 170
                                    }
                                ]
                            },
                            {
                                columnWidth: 0.3,
                                border: false,
                                defaults: {
                                    msgTarget: 'under'
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: _('fred.themes.theme_folder'),
                                        name: 'theme_folder',
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: _('fred.themes.default_element'),
                                        name: 'default_element',
                                    },
                                    {
                                        xtype: 'displayfield',
                                        fieldLabel: _('fred.themes.namespace'),
                                        name: 'namespace',
                                    },
                                    {
                                        xtype: 'displayfield',
                                        fieldLabel: _('fred.themes.settings_prefix'),
                                        name: 'settingsPrefix',
                                    }
                                ]
                            }
                        ]
                    },
                ]
            }
        ];
    },

    getColumnsGrid: function (config) {
        var items = [
            {
                html: '<br />',
                bodyCssClass: 'transparent-background'
            }
        ];

        items.push([
            {
                deferredRender: false,
                border: true,
                defaults: {
                    autoHeight: true,
                    layout: 'form',
                    labelWidth: 150,
                    bodyCssClass: 'main-wrapper',
                    layoutOnTabChange: true
                },
                items: [
                    {
                        defaults: {
                            msgTarget: 'side',
                            autoHeight: true
                        },
                        cls: 'form-with-labels',
                        border: false,
                        items: [
                            {
                                layout: 'column',
                                border: false,
                                height: 100,
                                defaults: {
                                    layout: 'form',
                                    labelAlign: 'top',
                                    labelSeparator: '',
                                    anchor: '100%',
                                    border: false
                                },
                                items: [
                                    {
                                        columnWidth: 1,
                                        border: false,
                                        defaults: {
                                            msgTarget: 'under'
                                        },
                                        items: [
                                            {
                                                xtype: 'displayfield',
                                                fieldLabel: _('fred.themes.settings'),
                                            },
                                            fred.field.JSONField({name: 'settings'})
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]);

        return items;
    }
});
Ext.reg('fred-panel-theme', fred.panel.Theme);
