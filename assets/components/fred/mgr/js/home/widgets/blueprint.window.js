fred.window.Blueprint = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.blueprints.quick_update'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'mgr/blueprints/update',
        modal: true,
        fields: this.getFields(config),
        autoHeight: true,
        width: 800
    });
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
                                xtype: 'modx-combo-browser',
                                fieldLabel: _('fred.blueprints.image'),
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
                                    select: function (data) {
                                        this.setValue(data.fullRelativeUrl);
                                        this.updatePreview();
                                    },
                                    change: function (cb, nv) {
                                        this.updatePreview();
                                    }
                                }
                            },
                            {
                                id: 'image_preview',
                                html: '<img src="' + (config.record.image ? fred.prependBaseUrl(config.record.image) : "https://via.placeholder.com/300x150?text=No+image") + '" style="max-height: 400px;max-width: 770px;margin-top: 15px;">'
                            }
                        ]
                    }
                ]
            }];
    }
});
Ext.reg('fred-window-blueprint', fred.window.Blueprint);
