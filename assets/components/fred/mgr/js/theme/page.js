fred.page.Theme = function (config) {
    config = config || {};

    config.isUpdate = (MODx.request.id) ? true : false;

    Ext.applyIf(config, {
        formpanel: 'fred-panel-theme',
        buttons: [
            {
                text: _('save'),
                method: 'remote',
                process: config.isUpdate ? 'Fred\\Processors\\Themes\\Update' : 'Fred\\Processors\\Themes\\Create',
                keys: [
                    {
                        key: MODx.config.keymap_save || 's',
                        ctrl: true
                    }
                ]
            },
            {
                text: _('cancel'),
                params: {
                    a: 'home',
                    namespace: 'fred'
                }
            }
        ],
        components: [
            {
                xtype: 'fred-panel-theme',
                isUpdate: config.isUpdate,
            }
        ]
    });
    fred.page.Theme.superclass.constructor.call(this, config);
};
Ext.extend(fred.page.Theme, MODx.Component);
Ext.reg('fred-page-theme', fred.page.Theme);
