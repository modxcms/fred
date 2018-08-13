fred.window.BlueprintCategory = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.blueprint_categories.create'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'mgr/blueprint_categories/create',
        modal: true,
        autoHeight: true,
        fields: this.getFields(config)
    });
    fred.window.BlueprintCategory.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.BlueprintCategory, MODx.Window, {
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
                fieldLabel: _('fred.blueprint_categories.name'),
                name: 'name',
                anchor: '100%',
                allowBlank: false
            },
            {
                xtype: 'fred-combo-themes',
                fieldLabel: _('fred.blueprint_categories.theme'),
                name: 'theme',
                hiddenName: 'theme',
                anchor: '100%',
                disabled: config.isUpdate,
                allowBlank: false
            },
            {
                xtype: 'fred-combo-boolean',
                useInt: true,
                fieldLabel: _('fred.blueprint_categories.public'),
                name: 'public',
                hiddenName: 'public',
                anchor: '100%',
                value: 1
            },
            {
                xtype: 'numberfield',
                allowDecimals: false,
                allowNegative: false,
                fieldLabel: _('fred.blueprint_categories.rank'),
                name: 'rank',
                anchor: '100%',
                allowBlank: true
            }
        ];
    }
});
Ext.reg('fred-window-blueprint-category', fred.window.BlueprintCategory);
