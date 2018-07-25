fred.panel.Element = function (config) {
    config = config || {};

    config.id = config.id || 'fred-panel-element';

    Ext.applyIf(config, {
        border: false,
        cls: 'container',
        url: fred.config.connectorUrl,
        baseParams: {
            action: 'mgr/elements/update'
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
    fred.panel.Element.superclass.constructor.call(this, config);
};

Ext.extend(fred.panel.Element, MODx.FormPanel, {
    setup: function () {
        if (this.config.isUpdate) {
            MODx.Ajax.request({
                url: this.config.url,
                params: {
                    action: 'mgr/elements/get',
                    id: MODx.request.id
                },
                listeners: {
                    'success': {
                        fn: function (r) {
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
    }


    , success: function (o, r) {
        if (this.config.isUpdate == false) {
            fred.loadPage('element/update', {id: o.result.object.id});
        }
    }

    , getItems: function (config) {
        return [
            {
                html: '<h2>' + ((config.isUpdate == true) ? _('fred.elements.update') : _('fred.elements.create')) + '</h2>',
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
    }

    , getGeneralFields: function (config) {
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
                                                fieldLabel: _('fred.elements.name'),
                                                name: 'name',
                                                anchor: '100%',
                                                allowBlank: false
                                            },
                                            {
                                                xtype: 'textarea',
                                                fieldLabel: _('fred.elements.description'),
                                                name: 'description',
                                                anchor: '100%',
                                                height: 100
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
                                                xtype: 'fred-combo-element-categories',
                                                fieldLabel: _('fred.elements.category'),
                                                name: 'category',
                                                hiddenName: 'category',
                                                anchor: '100%'
                                            },
                                            {
                                                xtype: 'numberfield',
                                                allowDecimals: false,
                                                allowNegative: false,
                                                fieldLabel: _('fred.elements.rank'),
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
                                                xtype: 'modx-combo-browser',
                                                fieldLabel: _('fred.elements.image'),
                                                triggerClass: 'x-form-image-trigger',
                                                name: 'image',
                                                anchor: '100%',
                                                allowBlank: false,
                                                updatePreview: function () {
                                                    Ext.getCmp('image_preview').el.dom.querySelector('img').src = (this.getValue() || "https://via.placeholder.com/800x100?text=No+image");
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
                                            },
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
                xtype: 'modx-tabs',
                forceLayout: true,
                deferredRender: false,
                collapsible: false,
                items: [
                    {
                        title: _('fred.elements.markup'),
                        layout: 'form',
                        bodyCssClass: 'tab-panel-wrapper main-wrapper',
                        autoHeight: true,
                        defaults: {
                            border: false,
                            msgTarget: 'under',
                            width: 400
                        },
                        items: [
                            {
                                xtype: Ext.ComponentMgr.isRegistered('modx-texteditor') ? 'modx-texteditor' : 'textarea',
                                mimeType: 'text/html',
                                name: 'content',
                                id: 'fred-element-content',
                                hideLabel: true,
                                anchor: '100%',
                                height: 400,
                                grow: false,
                                value: '',
                                listeners: {
                                    render: function() {
                                        if ((this.xtype === 'modx-texteditor') && this.editor)
                                            this.editor.getSession().setMode('ace/mode/twig')
                                    }
                                }
                            }
                        ]
                    },
                    {
                        title: _('fred.elements.settings'),
                        layout: 'form',
                        bodyCssClass: 'tab-panel-wrapper main-wrapper',
                        autoHeight: true,
                        defaults: {
                            border: false,
                            msgTarget: 'under',
                            width: 400
                        },
                        items: []
                    }
                ]
            }
        ];

        return items;
    }
});
Ext.reg('fred-panel-element', fred.panel.Element);
