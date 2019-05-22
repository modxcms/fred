fred.window.ThemeBuildResolver = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.themes.add_resolver'),
        modal: true,
        autoHeight: true,
        fields: this.getFields(config)
    });
    fred.window.ThemeBuildResolver.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.ThemeBuildResolver, MODx.Window, {
    getFields: function (config) {
        return [
            {
                xtype: 'modx-combo-browser',
                fieldLabel: _('fred.themes.resolver'),
                allowedFileTypes: 'php',
                name: 'file',
                hiddenName: 'file',
                anchor: '100%',
                allowBlank: false,
                listeners: {
                    select: function(image) {
                        this.setValue(image.pathname);
                    }
                }
            }
        ];
    }
});
Ext.reg('fred-window-theme-build-resolver', fred.window.ThemeBuildResolver);
