fred.window.Element = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.elements.quick_update'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'mgr/elements/update',
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
    fred.window.Element.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.Element, MODx.Window, {
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
                                    select: function (data) {
                                        this.setValue(MODx.config.base_url + data.relativeUrl);
                                        this.updatePreview();
                                    },
                                    change: function (cb, nv) {
                                        this.updatePreview();
                                    }
                                }
                            },
                            {
                                id: 'image_preview',
                                html: '<img src="' + (config.record.image || "https://via.placeholder.com/800x100?text=No+image") + '" style="max-height: 400px;max-width: 770px;margin-top: 15px;">'
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
            }
        ]
    }
});
Ext.reg('fred-window-element-duplicate', fred.window.ElementDuplicate);
