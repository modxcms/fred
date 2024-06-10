fred.window.ElementOptionSet = function (config) {
    config = config || {};

    config.showSaveCloseOnly = config.showSaveCloseOnly || false;

    Ext.applyIf(config, {
        title: _('fred.element_option_sets.quick_update'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'Fred\\Processors\\ElementOptionSets\\Update',
        modal: false,
        fields: this.getFields(config),
        autoHeight: true,
        width: 800,
        buttonAlign: 'left',
        buttons: this.getButtons(config),
        keys: [
            {
                key: Ext.EventObject.ENTER,
                shift: true,
                fn: this.submit,
                scope: this
            }
        ]
    });
    fred.window.ElementOptionSet.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.ElementOptionSet, MODx.Window, {
    getButtons: function(config) {
        var buttons = [
            {
                xtype: 'fred-button-help',
                path: 'themer/cmp/option_sets/'
            },
            '->',
            {
                text: config.cancelBtnText || _('cancel'),
                    scope: this,
                handler: function () {
                config.closeAction !== 'close' ? this.hide() : this.close();
            }
        }];


        if (!config.showSaveCloseOnly) {
            buttons.push({
                text: config.saveBtnText || _('save'),
                scope: this,
                handler: function () {
                    this.submit(false);
                }
            });
        }

        buttons.push({
            text: config.saveCloseBtnText || _('save_and_close'),
            cls: 'primary-button',
            scope: this,
            handler: this.submit
        });

        return buttons;
    },

    getFields: function (config) {
        return [
            {
                xtype: 'textfield',
                name: 'id',
                anchor: '100%',
                hidden: true
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
                                fieldLabel: _('fred.element_option_sets.name'),
                                name: 'name',
                                anchor: '100%',
                                allowBlank: false
                            },
                            {
                                xtype: 'textarea',
                                fieldLabel: _('fred.element_option_sets.description'),
                                name: 'description',
                                anchor: '100%',
                                allowBlank: true
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
                                fieldLabel: _('fred.element_option_sets.theme'),
                                name: 'theme',
                                hiddenName: 'theme',
                                anchor: '100%',
                                allowBlank: false,
                                isUpdate: config.isUpdate
                            },
                            {
                                xtype: 'fred-combo-boolean',
                                useInt: true,
                                fieldLabel: _('fred.element_option_sets.complete'),
                                name: 'complete',
                                hiddenName: 'complete',
                                anchor: '100%',
                                value: 1
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
                            fred.field.JSONField({
                                fieldLabel: _('fred.element_option_sets.data'),
                                hideLabel: false,
                                setValue: function (v) {
                                    if (Array.isArray(v) && v.length === 0) {
                                        v = '';
                                    } else {
                                        if (typeof v === 'object') {
                                            v = JSON.stringify(v, null, 2);
                                        }
                                    }

                                    this.superclass().setValue.call(this, v);
                                }
                            })
                        ]
                    }
                ]
            }]
            ;
    }
});
Ext.reg('fred-window-element-option-set', fred.window.ElementOptionSet);

fred.window.ElementOptionSetDuplicate = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.element_option_sets.duplicate'),
        closeAction: 'close',
        isUpdate: true,
        url: fred.config.connectorUrl,
        action: 'Fred\\Processors\\ElementOptionSets\\Duplicate',
        modal: true,
        fields: this.getFields(config),
        autoHeight: true,
        keys: [
            {
                key: Ext.EventObject.ENTER,
                shift: true,
                fn: this.submit,
                scope: this
            }
        ]
    });
    fred.window.ElementOptionSetDuplicate.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.ElementOptionSetDuplicate, MODx.Window, {
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
                fieldLabel: _('fred.element_option_sets.new_name'),
                name: 'name',
                anchor: '100%',
                allowBlank: true
            },
            {
                xtype: 'fred-combo-themes',
                fieldLabel: _('fred.element_option_sets.theme'),
                name: 'theme',
                hiddenName: 'theme',
                anchor: '100%',
                allowBlank: false,
                isUpdate: config.isUpdate
            }
        ]
    }
});
Ext.reg('fred-window-element-option-set-duplicate', fred.window.ElementOptionSetDuplicate);

fred.window.ElementOptionSetPreview = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.element_option_sets.preview'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'Fred\\Processors\\ElementOptionSets\\Update',
        modal: false,
        fields: this.getFields(config),
        autoHeight: true,
        width: 800,
        buttons: [{
            text: _('cancel'),
            scope: this,
            handler: function() {
                this.close();
            }
        }]
    });
    fred.window.ElementOptionSetPreview.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.ElementOptionSetPreview, MODx.Window, {
    getFields: function (config) {
        return [
            {
                xtype: Ext.ComponentMgr.isRegistered('modx-texteditor') ? 'modx-texteditor' : 'textarea',
                mimeType: 'application/json',
                name: 'data',
                hideLabel: true,
                anchor: '100%',
                height: 400,
                grow: false,
                value: ''
            }
        ]
    }
});
Ext.reg('fred-window-element-option-set-preview', fred.window.ElementOptionSetPreview);
