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
                            if (Array.isArray(r.object.options_override) && r.object.options_override.length === 0) {
                                r.object.options_override = '';
                            } else {
                                if (typeof r.object.options_override === 'object') {
                                    r.object.options_override = JSON.stringify(r.object.options_override, null, 2);
                                }
                            }
                            
                            if (r.object.option_set === 0) {
                                Ext.getCmp('fred-element-panel-preview-option-set').disable();
                            }
                            
                            this.getForm().setValues(r.object);

                            var category = this.find('name', 'category');
                            if (category[0]) {
                                category = category[0];
                                category.baseParams.theme = r.object.theme;
                            }

                            if (r.object.image) {
                                r.object.image = fred.prependBaseUrl(r.object.image);
                            } else {
                                r.object.image = "https://via.placeholder.com/300x150?text=No+image";
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
            Ext.getCmp('fred-element-panel-preview-option-set').disable();
            
            var theme = MODx.request.theme;
            if (theme) {
                var categoryField = this.find('name', 'category');
                if (!categoryField[0]) return;

                var category = MODx.request.category;
                
                this.getForm().setValues({theme: theme, category: category});

                categoryField = categoryField[0];
                categoryField.enable();
                categoryField.baseParams.theme = theme;
            }
            
            this.fireEvent('ready');
            MODx.fireEvent('ready');
        }
    },


    success: function (o, r) {
        if (this.config.isUpdate == false) {
            fred.loadPage('element/update', {id: o.result.object.id});
        }
    },

    getItems: function (config) {
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
                                                xtype: 'fred-combo-themes',
                                                fieldLabel: _('fred.elements.theme'),
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
                                                xtype: 'fred-combo-element-categories',
                                                fieldLabel: _('fred.elements.category'),
                                                name: 'category',
                                                hiddenName: 'category',
                                                anchor: '100%',
                                                disabled: !config.isUpdate,
                                                allowBlank: false
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
                                                allowBlank: true,
                                                updatePreview: function () {
                                                    var value = this.getValue();
                                                    
                                                    if (value) {
                                                        value = fred.prependBaseUrl(value);
                                                    } else {
                                                        value = "https://via.placeholder.com/300x150?text=No+image";
                                                    }
                                                    
                                                    Ext.getCmp('image_preview').el.dom.querySelector('img').src = value;
                                                },
                                                listeners: {
                                                    'select': {
                                                        fn: function (data) {
                                                            this.setValue(data.fullRelativeUrl);
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
                defaults: {
                    layout: 'form',
                    labelAlign: 'top',
                    labelSeparator: '',
                    anchor: '100%',
                    border: false
                },
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
                                    render: function () {
                                        if ((this.xtype === 'modx-texteditor') && this.editor)
                                            this.editor.getSession().setMode('ace/mode/twig')
                                    }
                                }
                            }
                        ]
                    },
                    {
                        title: _('fred.elements.options'),
                        layout: 'form',
                        bodyCssClass: 'tab-panel-wrapper main-wrapper',
                        autoHeight: true,
                        defaults: {
                            layout: 'form',
                            labelAlign: 'top',
                            labelSeparator: '',
                            anchor: '100%',
                            border: false,
                            msgTarget: 'under',
                            width: 400
                        },
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
                                        columnWidth: .8,
                                        border: false,
                                        defaults: {
                                            msgTarget: 'under',
                                            anchor: '100%'
                                        },
                                        items: [
                                            {
                                                xtype: 'fred-combo-element-option-sets',
                                                name: 'option_set',
                                                hiddenName: 'option_set',
                                                baseParams: {
                                                    action: 'mgr/element_option_sets/getlist',
                                                    addEmpty: 1,
                                                    complete: 1
                                                },
                                                fieldLabel: _('fred.elements.option_set'),
                                                listeners: {
                                                    select: {
                                                        fn: function(combo) {
                                                            var previewButton = Ext.getCmp('fred-element-panel-preview-option-set');
                                                            
                                                            if (combo.getValue() === 0) {
                                                                previewButton.disable();
                                                            } else {
                                                                previewButton.enable();
                                                            }
                                                        },
                                                        scope: this
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        columnWidth: .2,
                                        border: false,
                                        defaults: {
                                            msgTarget: 'under',
                                            anchor: '100%'
                                        },
                                        items: [
                                            {
                                                xtype: 'button',
                                                id: 'fred-element-panel-preview-option-set',
                                                text: _('fred.element_option_sets.preview'),
                                                fieldLabel: '&nbsp;',
                                                handler: this.previewOptionSet,
                                                scope: this
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype: Ext.ComponentMgr.isRegistered('modx-texteditor') ? 'modx-texteditor' : 'textarea',
                                fieldLabel: _('fred.elements.options_override'),
                                mimeType: 'application/json',
                                name: 'options_override',
                                id: 'fred-element-options-override',
                                anchor: '100%',
                                height: 400,
                                grow: false,
                            }
                        ]
                    }
                ]
            }
        ];

        return items;
    },

    previewOptionSet: function(btn, e) {
        var optionSetId = this.getField('option_set').getValue();
        
        if (optionSetId === 0) return;
        
        MODx.Ajax.request({
            url: this.config.url,
            params: {
                action: 'mgr/element_option_sets/get',
                id: optionSetId
            },
            listeners: {
                'success': {
                    fn: function (r) {
                        var record = {data: ''};
                        
                        if (Array.isArray(r.object.data) && r.object.data.length === 0) {
                            record.data = '';
                        } else {
                            if (typeof r.object.data === 'object') {
                                record.data = JSON.stringify(r.object.data, null, 2);
                            }
                        }

                        var updateElementOptionSet = MODx.load({
                            xtype: 'fred-window-element-option-set-preview',
                            record: record,
                            listeners: {
                                success: {
                                    fn: function () {
                                        this.refresh();
                                    },
                                    scope: this
                                }
                            }
                        });

                        updateElementOptionSet.fp.getForm().reset();
                        updateElementOptionSet.fp.getForm().setValues(record);
                        updateElementOptionSet.show(e.target);
                    },
                    scope: this
                }
            }
        });
        

        
    }
});
Ext.reg('fred-panel-element', fred.panel.Element);
