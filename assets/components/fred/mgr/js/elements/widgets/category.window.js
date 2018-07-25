fred.window.ElementCategory = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.element_categories.create'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'mgr/element_categories/create',
        modal: true,
        fields: this.getFields(config)
    });
    fred.window.ElementCategory.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.ElementCategory, MODx.Window, {
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
                fieldLabel: _('fred.element_categories.name'),
                name: 'name',
                anchor: '100%',
                allowBlank: false
            },
            {
                xtype: 'numberfield',
                allowDecimals: false,
                allowNegative: false,
                fieldLabel: _('fred.element_categories.rank'),
                name: 'rank',
                anchor: '100%',
                allowBlank: true
            }
        ];
    }
});
Ext.reg('fred-window-element-category', fred.window.ElementCategory);
