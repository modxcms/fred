fred.window.Element = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.elements.quick_update'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'mgr/elements/update',
        modal: false,
        fields: this.getFields(config),
        autoHeight: true,
        width: 800,
        buttonAlign: 'left',
        buttons: [
            {
                xtype: 'fred-button-help',
                path: 'cmp/elements/'
            },
            '->',
            {
                text: config.cancelBtnText || _('cancel'),
                scope: this,
                handler: function () {
                    config.closeAction !== 'close' ? this.hide() : this.close();
                }
            },
            {
                text: config.saveBtnText || _('save'),
                scope: this,
                handler: function() { this.submit(false); }
            },
            {
                text: config.saveBtnText || _('save_and_close'),
                cls: 'primary-button',
                scope: this,
                handler: this.submit
            }
        ],
        keys: [
            {
                key: Ext.EventObject.ENTER,
                shift: true,
                fn: this.submit,
                scope: this
            }
        ]
    });
    fred.window.Element.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.Element, MODx.Window, {
    getFields: function (config) {
        return [
            {
                xtype: 'hidden',
                name: 'id',
            },
            {
                xtype: 'hidden',
                name: 'rank'
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
                        columnWidth: .5,
                        border: false,
                        defaults: {
                            msgTarget: 'under',
                            anchor: '100%'
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
                                allowBlank: true,
                                height: 100
                            }
                        ]
                    },
                    {
                        columnWidth: .5,
                        border: false,
                        defaults: {
                            msgTarget: 'under',
                            anchor: '100%'
                        },
                        items: [
                            {
                                xtype: 'fred-combo-themes',
                                fieldLabel: _('fred.elements.theme'),
                                name: 'theme_id',
                                hiddenName: 'theme_id',
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
                                allowBlank: false
                            },
                            {
                                xtype: 'fred-combo-element-option-sets',
                                name: 'option_set',
                                hiddenName: 'option_set',
                                anchor: '100%',
                                baseParams: {
                                    action: 'mgr/element_option_sets/getlist',
                                    addEmpty: 1,
                                    complete: 1
                                },
                                fieldLabel: _('fred.elements.option_set')
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
                                listeners: {
                                    select: function (data) {
                                        this.setValue(data.fullRelativeUrl);
                                    }
                                }
                            },
                            {
                                xtype: Ext.ComponentMgr.isRegistered('modx-texteditor') ? 'modx-texteditor' : 'textarea',
                                mimeType: 'text/html',
                                name: 'content',
                                fieldLabel: _('fred.elements.content'),
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
                    }
                ]
            }]
            ;
    }
});
Ext.reg('fred-window-element', fred.window.Element);

fred.window.ElementDuplicate = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.elements.duplicate'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'mgr/elements/duplicate',
        modal: true,
        fields: this.getFields(config),
        autoHeight: true,
        width: 800,
        keys: [
            {
                key: Ext.EventObject.ENTER,
                shift: true,
                fn: this.submit,
                scope: this
            }
        ]
    });
    fred.window.ElementDuplicate.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.ElementDuplicate, MODx.Window, {
    getFields: function (config) {
        return [
            {
                xtype: 'textfield',
                name: 'id',
                anchor: '100%',
                hidden: true
            },
            {
                xtype: 'textfield',
                fieldLabel: _('fred.elements.new_name'),
                name: 'name',
                anchor: '100%',
                allowBlank: true
            },
            {
                xtype: 'fred-combo-themes',
                fieldLabel: _('fred.elements.theme'),
                name: 'theme_id',
                hiddenName: 'theme_id',
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
                allowBlank: false
            },
            {
                xtype: 'fred-combo-element-categories',
                fieldLabel: _('fred.elements.category'),
                name: 'category',
                hiddenName: 'category',
                anchor: '100%',
                allowBlank: false
            }
        ]
    }
});
Ext.reg('fred-window-element-duplicate', fred.window.ElementDuplicate);
