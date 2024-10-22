fred.panel.Blueprint = function (config) {
    config = config || {};
    config.permission = config.permission || {};

    config.id = config.id || 'fred-panel-blueprint';

    Ext.applyIf(config, {
        border: false,
        cls: 'container',
        baseCls: 'modx-formpanel',
        url: fred.config.connectorUrl,
        baseParams: {
            action: 'Fred\\Processors\\Blueprints\\Update'
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

    this.settingsPrefix = '';

    fred.panel.Blueprint.superclass.constructor.call(this, config);
};

Ext.extend(fred.panel.Blueprint, MODx.FormPanel, {
    setup: function () {
        if (this.config.isUpdate) {
            MODx.Ajax.request({
                url: this.config.url,
                params: {
                    action: 'Fred\\Processors\\Blueprints\\Get',
                    id: MODx.request.id
                },
                listeners: {
                    'success': {
                        fn: function (r) {
                            if (Array.isArray(r.object.data) && r.object.data.length === 0) {
                                r.object.data = '';
                            } else {
                                if (typeof r.object.data === 'object') {
                                    r.object.data = JSON.stringify(r.object.data, null, 2);
                                }
                            }

                            var templates = this.find('name', 'templates');
                            if (templates[0]) {
                                templates = templates[0];
                                templates.baseParams.theme = r.object.theme;
                            }

                            r.object['templates[]'] = r.object.templates;

                            this.getForm().setValues(r.object);
                            if (r.object.image) {
                                this.settingsPrefix = r.object.settingsPrefix;
                                r.object.image = fred.prependBaseUrl(r.object.image, r.object.settingsPrefix);
                            } else {
                                r.object.image = "https://placehold.co/300x150?text=No+image";
                            }

                            Ext.getCmp('image_preview').el.dom.querySelector('img').src = r.object.image;

                            this.fireEvent('ready', r.object);
                            MODx.fireEvent('ready');
                        },
                        scope: this
                    }
                }
            });
        } else {
            this.fireEvent('ready');
            MODx.fireEvent('ready');
        }
    },

    success: function (o, r) {
        if (this.config.isUpdate == false) {
            fred.loadPage('blueprint/update', {id: o.result.object.id});
        }
    },

    getItems: function (config) {
        return [
            MODx.util.getHeaderBreadCrumbs({
                html: ((config.isUpdate == true) ? _('fred.blueprints.update') : _('fred.blueprints.create')),
                xtype: "modx-header"
            }, [
                {
                    text: _('fred.home.page_title'),
                    href: '?a=home&namespace=fred',
                },
                {
                    text: _('fred.home.blueprints'),
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
                                        columnWidth: 0.7,
                                        border: false,
                                        defaults: {
                                            msgTarget: 'under'
                                        },
                                        items: [
                                            {
                                                xtype: 'textfield',
                                                fieldLabel: _('fred.blueprints.name'),
                                                name: 'name',
                                                anchor: '100%',
                                                allowBlank: false
                                            },
                                            {
                                                xtype: 'textarea',
                                                fieldLabel: _('fred.blueprints.description'),
                                                name: 'description',
                                                anchor: '100%',
                                                height: 170
                                            },
                                            {
                                                id: 'fred-blueprint-image-field',
                                                xtype: 'modx-combo-browser',
                                                fieldLabel: _('fred.blueprints.image'),
                                                triggerClass: 'x-form-image-trigger',
                                                name: 'image',
                                                anchor: '100%',
                                                allowBlank: true,
                                                updatePreview: function (settingsPrefix = '') {
                                                    var value = this.getValue();

                                                    if (value) {
                                                        value = fred.prependBaseUrl(value, settingsPrefix);
                                                    } else {
                                                        value = "https://placehold.co/300x150?text=No+image";
                                                    }

                                                    Ext.getCmp('image_preview').el.dom.querySelector('img').src = value;
                                                },
                                                listeners: {
                                                    'select': {
                                                        fn: function (data) {
                                                            this.setValue(data.fullRelativeUrl);
                                                            this.updatePreview('');
                                                        }
                                                    },
                                                    'change': {
                                                        fn: function (cb, nv) {
                                                            cb.updatePreview(this.settingsPrefix);
                                                        },
                                                        scope: this
                                                    }
                                                }
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
                                                xtype: 'fred-combo-themes',
                                                fieldLabel: _('fred.blueprints.theme'),
                                                name: 'theme',
                                                hiddenName: 'theme',
                                                anchor: '100%',
                                                listeners: {
                                                    select: function(combo, record) {
                                                        var category = this.find('name', 'category');
                                                        if (!category[0]) return;

                                                        this.settingsPrefix = record.data.settingsPrefix;

                                                        category = category[0];
                                                        category.setValue();
                                                        category.enable();
                                                        category.baseParams.theme = record.id;
                                                        category.store.load();

                                                        var templates = this.find('name', 'templates');
                                                        if (!templates[0]) return;

                                                        templates = templates[0];
                                                        templates.setValue();
                                                        templates.enable();
                                                        templates.baseParams.theme = record.id;
                                                        templates.lastQuery = null;
                                                        templates.loaded = false;
                                                        templates.tries = 0;

                                                        templates.store.on('load', function() {
                                                            this.loaded = true;
                                                        }, templates, {single: true});

                                                        if (templates.pageTb) {
                                                            templates.pageTb.show();
                                                        }

                                                        var image = Ext.getCmp('fred-blueprint-image-field');
                                                        if (image) {
                                                            image.updatePreview(this.settingsPrefix);
                                                        }
                                                    },
                                                    scope: this
                                                },
                                                allowBlank: false,
                                                isUpdate: config.isUpdate
                                            },
                                            {
                                                xtype: 'fred-combo-blueprint-categories',
                                                fieldLabel: _('fred.blueprints.category'),
                                                name: 'category',
                                                hiddenName: 'category',
                                                anchor: '100%',
                                                allowBlank: false
                                            },
                                            {
                                                xtype: 'fred-combo-themed-template',
                                                fieldLabel: _('fred.blueprints.templates'),
                                                anchor: '100%',
                                                allowBlank: true
                                            },
                                            {
                                                xtype: 'fred-combo-boolean',
                                                useInt: true,
                                                fieldLabel: _('fred.blueprints.public'),
                                                name: 'public',
                                                hiddenName: 'public',
                                                anchor: '100%',
                                                disabled: !config.permission.fred_blueprints_create_public,
                                                value: config.permission.fred_blueprints_create_public ? 1 : 0
                                            },
                                            {
                                                xtype: 'numberfield',
                                                allowDecimals: false,
                                                allowNegative: false,
                                                fieldLabel: _('fred.blueprints.rank'),
                                                name: 'rank',
                                                anchor: '100%',
                                                allowBlank: true
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                layout: 'column',
                                border: false,
                                anchor: '100%',
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
                                            msgTarget: 'under',
                                            anchor: '100%'
                                        },
                                        items: [
                                            {
                                                id: 'image_preview',
                                                html: '<img src="' + "https://placehold.co/800x100?text=No+image" + '" style="max-height: 800px;max-width: 100%;margin-top: 15px;">',
                                                listeners: {
                                                    render: function () {
                                                        this.el.dom.style.textAlign = 'center';
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
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
                                            fred.field.JSONField()
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
Ext.reg('fred-panel-blueprint', fred.panel.Blueprint);
