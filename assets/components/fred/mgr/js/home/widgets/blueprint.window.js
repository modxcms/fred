fred.window.Blueprint = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.blueprints.quick_update'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'Fred\\Processors\\Blueprints\\Update',
        modal: true,
        fields: this.getFields(config),
        autoHeight: true,
        buttonAlign: 'left',
        buttons: [
            {
                xtype: 'fred-button-help',
                path: 'blueprints.html'
            },
            '->',
            {
                text: config.cancelBtnText || _('cancel'),
                scope: this,
                handler: function() { config.closeAction !== 'close' ? this.hide() : this.close(); }
            },
            {
                text: config.saveBtnText || _('save'),
                cls: 'primary-button',
                scope: this,
                handler: this.submit
            }
        ],
        width: 800
    });

    this.settingsPrefix = config.record.theme_settingsPrefix;

    fred.window.Blueprint.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.Blueprint, MODx.Window, {
    getFields: function (config) {
        return [
            {
                xtype: 'hidden',
                name: 'id'
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
                                fieldLabel: _('fred.blueprints.theme'),
                                name: 'theme_id',
                                hiddenName: 'theme_id',
                                anchor: '100%',
                                isUpdate: config.isUpdate,
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

                                        var image = Ext.getCmp('fred-blueprint-image-field');
                                        if (image) {
                                            image.updatePreview(this.settingsPrefix);
                                        }
                                    },
                                    scope: this
                                },
                                allowBlank: false
                            },
                            {
                                xtype: 'fred-combo-blueprint-categories',
                                fieldLabel: _('fred.blueprints.category'),
                                name: 'category',
                                hiddenName: 'category',
                                anchor: '100%'
                            },
                            {
                                xtype: 'fred-combo-boolean',
                                useInt: true,
                                fieldLabel: _('fred.blueprints.public'),
                                name: 'public',
                                hiddenName: 'public',
                                anchor: '100%',
                                disabled: !config.canPublic,
                                value: config.canPublic ? 1 : 0
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
                                id: 'fred-blueprint-image-field',
                                xtype: 'modx-combo-browser',
                                fieldLabel: _('fred.blueprints.image'),
                                triggerClass: 'x-form-image-trigger',
                                name: 'image',
                                anchor: '100%',
                                allowBlank: true,
                                updatePreview: function (settingsPrefix) {
                                    var value = this.getValue();
                                    if (value) {
                                        value = fred.prependBaseUrl(value, settingsPrefix);
                                    } else {
                                        value = "https://placehold.co/300x150?text=No+image";
                                    }

                                    Ext.getCmp('image_preview').el.dom.querySelector('img').src = value;
                                },
                                listeners: {
                                    select: function (data) {
                                        this.setValue(data.fullRelativeUrl);
                                        this.updatePreview('');
                                    },
                                    change: {
                                        fn:function (cb, nv) {
                                            cb.updatePreview(this.settingsPrefix);
                                        },
                                        scope: this
                                    }
                                }
                            },
                            {
                                id: 'image_preview',
                                html: '<img src="' + (config.record.image ? fred.prependBaseUrl(config.record.image, config.record.theme_settingsPrefix) : "https://placehold.co/300x150?text=No+image") + '" style="max-height: 400px;max-width: 770px;margin-top: 15px;">'
                            }
                        ]
                    }
                ]
            }];
    }
});
Ext.reg('fred-window-blueprint', fred.window.Blueprint);
