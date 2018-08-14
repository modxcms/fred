fred.window.ThemedTemplate = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.themed_templates.create'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'mgr/themed_templates/create',
        modal: true,
        autoHeight: true,
        fields: this.getFields(config)
    });
    fred.window.ThemedTemplate.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.ThemedTemplate, MODx.Window, {
    getFields: function (config) {
        var fields = [];

        if (config.isUpdate) {
            fields.push({
                xtype: 'hidden',
                name: 'template'
            });
        }
        
        fields.push([
            {
                xtype: config.isUpdate ? 'modx-combo-template' : 'fred-combo-template',
                fieldLabel: _('fred.themed_templates.template'),
                name: config.isUpdate ? 'template_value' : 'templates',
                hiddenName: config.isUpdate ? 'template_value' : 'templates[]',
                anchor: '100%',
                allowBlank: false,
                disabled: config.isUpdate
            },
            {
                xtype: 'fred-combo-themes',
                fieldLabel: _('fred.themed_templates.theme'),
                name: 'theme',
                anchor: '100%',
                allowBlank: true
            }
        ]);
        
        return fields;
    }
});
Ext.reg('fred-window-themed-template', fred.window.ThemedTemplate);