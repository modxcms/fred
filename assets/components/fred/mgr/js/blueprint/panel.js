fred.panel.Blueprint = function (config) {
    config = config || {};

    config.id = config.id || 'fred-panel-blueprint';

    Ext.applyIf(config, {
        border: false,
        cls: 'container',
        url: fred.config.connectorUrl,
        baseParams: {
            action: 'mgr/blueprints/update'
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
    fred.panel.Blueprint.superclass.constructor.call(this, config);
};

Ext.extend(fred.panel.Blueprint, MODx.FormPanel, {
    setup: function () {
        if (this.config.isUpdate) {
            MODx.Ajax.request({
                url: this.config.url,
                params: {
                    action: 'mgr/blueprints/get',
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
                            
                            this.getForm().setValues(r.object);

                            Ext.getCmp('image_preview').el.dom.querySelector('img').src = (r.object.image || "https://via.placeholder.com/800x100?text=No+image");

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
            {
                html: '<h2>' + ((config.isUpdate == true) ? _('fred.blueprints.update') : _('fred.blueprints.create')) + '</h2>',
                border: false,
                cls: 'modx-page-header'
            },
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
                                                height: 100
                                            },
                                            {
                                                xtype: 'modx-combo-browser',
                                                fieldLabel: _('fred.blueprints.image'),
                                                triggerClass: 'x-form-image-trigger',
                                                name: 'image',
                                                anchor: '100%',
                                                allowBlank: true,
                                                updatePreview: function () {
                                                    Ext.getCmp('image_preview').el.dom.querySelector('img').src = (this.getValue() || "https://via.placeholder.com/300x150?text=No+image");
                                                },
                                                listeners: {
                                                    'select': {
                                                        fn: function (data) {
                                                            this.setValue(MODx.config.base_url + data.relativeUrl);
                                                            this.updatePreview();
                                                        }
                                                    },
                                                    'change': {
                                                        fn: function (cb, nv) {
                                                            this.updatePreview();
                                                        }
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

                                                        category = category[0];
                                                        category.setValue();
                                                        category.enable();
                                                        category.baseParams.theme = record.id;
                                                        category.store.load();
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
                                                xtype: 'fred-combo-boolean',
                                                useInt: true,
                                                fieldLabel: _('fred.blueprints.public'),
                                                name: 'public',
                                                hiddenName: 'public',
                                                anchor: '100%',
                                                value: 1
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
                                                html: '<img src="' + "https://via.placeholder.com/800x100?text=No+image" + '" style="max-height: 800px;max-width: 100%;margin-top: 15px;">',
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
                                            {
                                                xtype: Ext.ComponentMgr.isRegistered('modx-texteditor') ? 'modx-texteditor' : 'textarea',
                                                mimeType: 'application/json',
                                                name: 'data',
                                                id: 'data',
                                                hideLabel: true,
                                                anchor: '100%',
                                                height: 400,
                                                grow: false,
                                                value: ''
                                            }
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
