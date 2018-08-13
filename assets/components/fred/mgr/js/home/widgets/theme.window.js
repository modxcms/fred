fred.window.Theme = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.themes.create'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'mgr/themes/create',
        modal: true,
        autoHeight: true,
        fields: this.getFields(config),
        keys: [
            {
                key: Ext.EventObject.ENTER,
                shift: true,
                fn: this.submit,
                scope: this
            }
        ]
    });
    fred.window.Theme.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.Theme, MODx.Window, {
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
                fieldLabel: _('fred.themes.name'),
                name: 'name',
                anchor: '100%',
                allowBlank: false
            },
            {
                xtype: 'textarea',
                fieldLabel: _('fred.themes.description'),
                name: 'description',
                anchor: '100%',
                allowBlank: true
            }
        ];
    }
});
Ext.reg('fred-window-theme', fred.window.Theme);

fred.window.ThemeDuplicate = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.themes.duplicate'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'mgr/themes/duplicate',
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
    fred.window.ThemeDuplicate.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.ThemeDuplicate, MODx.Window, {
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
                fieldLabel: _('fred.themes.new_name'),
                name: 'name',
                anchor: '100%',
                allowBlank: true
            }
        ]
    }
});
Ext.reg('fred-window-theme-duplicate', fred.window.ThemeDuplicate);
