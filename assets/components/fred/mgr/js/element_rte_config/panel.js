fred.panel.ElementRTEConfig = function (config) {
    config = config || {};

    config.id = config.id || 'fred-panel-element-rte-config';

    Ext.applyIf(config, {
        border: false,
        cls: 'container',
        url: fred.config.connectorUrl,
        baseParams: {
            action: 'mgr/element_rte_configs/update'
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
    fred.panel.ElementRTEConfig.superclass.constructor.call(this, config);
};

Ext.extend(fred.panel.ElementRTEConfig, MODx.FormPanel, {
    setup: function () {
        if (this.config.isUpdate) {
            MODx.Ajax.request({
                url: this.config.url,
                params: {
                    action: 'mgr/element_rte_configs/get',
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
            fred.loadPage('element/rte_config/update', {id: o.result.object.id});
        }
    },

    getItems: function (config) {
        return [
            {
                html: '<h2>' + ((config.isUpdate == true) ? _('fred.element_rte_configs.update') : _('fred.element_rte_configs.create')) + '</h2>',
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
                                                xtype: 'textfield',
                                                fieldLabel: _('fred.element_rte_configs.name'),
                                                name: 'name',
                                                anchor: '100%',
                                                allowBlank: false
                                            },
                                            {
                                                xtype: 'textarea',
                                                fieldLabel: _('fred.element_rte_configs.description'),
                                                name: 'description',
                                                anchor: '100%',
                                                height: 100
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
Ext.reg('fred-panel-element-rte-config', fred.panel.ElementRTEConfig);
