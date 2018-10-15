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
        buttonAlign: 'left',
        buttons: [
            {
                xtype: 'fred-button-help',
                path: 'cmp/blueprint_categories/'
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
        fields: this.getFields(config)
    });
    fred.window.BlueprintCategory.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.BlueprintCategory, MODx.Window, {
    getFields: function (config) {
        var fields = [{
            xtype: 'hidden',
            name: 'id'
        }];

        if (config.isUpdate) {
            fields.push([{
                xtype: 'hidden',
                name: 'theme'
            }]);
        }
        
        fields.push([
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
                name: config.isUpdate ? 'theme_id' : 'theme',
                hiddenName: config.isUpdate ? 'theme_id' : 'theme',
                anchor: '100%',
                disabled: config.isUpdate,
                allowBlank: config.isUpdate,
                isUpdate: config.isUpdate
            },
            {
                xtype: 'fred-combo-boolean',
                useInt: true,
                fieldLabel: _('fred.blueprint_categories.public'),
                name: 'public',
                hiddenName: 'public',
                anchor: '100%',
                disabled: !config.canPublic,
                value: config.canPublic ? 1 : 0
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
        ]);
        
        return fields;
    }
});
Ext.reg('fred-window-blueprint-category', fred.window.BlueprintCategory);
