fred.window.ElementOptionSet = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.element_option_sets.quick_update'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'mgr/element_option_sets/update',
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
    fred.window.ElementOptionSet.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.ElementOptionSet, MODx.Window, {
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
                            {
                                xtype: 'textarea',
                                fieldLabel: _('fred.element_option_sets.description'),
                                name: 'description',
                                anchor: '100%',
                                allowBlank: true
                            },
                            {
                                xtype: Ext.ComponentMgr.isRegistered('modx-texteditor') ? 'modx-texteditor' : 'textarea',
                                mimeType: 'application/json',
                                name: 'data',
                                id: 'data',
                                fieldLabel: _('fred.element_option_sets.data'),
                                anchor: '100%',
                                height: 400,
                                grow: false,
                                value: '',
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
                            }
                        ]
                    }
                ]
            }]
            ;
    }
});
Ext.reg('fred-window-element-option-set', fred.window.ElementOptionSet);
