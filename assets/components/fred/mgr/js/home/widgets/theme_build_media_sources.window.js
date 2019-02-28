fred.window.ThemeBuildMediaSource = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.themes.add_media_source'),
        modal: true,
        autoHeight: true,
        fields: this.getFields(config)
    });
    fred.window.ThemeBuildMediaSource.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.ThemeBuildMediaSource, MODx.Window, {
    getFields: function (config) {
        return [
            {
                xtype: 'modx-combo-source',
                fieldLabel: _('fred.theme.media_source'),
                name: 'source',
                hiddenName: 'source',
                anchor: '100%',
                allowBlank: false
            }
        ];
    }
});
Ext.reg('fred-window-theme-build-media-source', fred.window.ThemeBuildMediaSource);