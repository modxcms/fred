fred.page.Blueprint = function (config) {
    config = config || {};

    config.isUpdate = (MODx.request.id) ? true : false;

    Ext.applyIf(config, {
        formpanel: 'fred-panel-blueprint',
        buttons: [
            {
                text: _('save'),
                method: 'remote',
                process: 'mgr/blueprints/update',
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
                xtype: 'fred-panel-blueprint',
                isUpdate: config.isUpdate,
            }
        ]
    });
    fred.page.Blueprint.superclass.constructor.call(this, config);
};
Ext.extend(fred.page.Blueprint, MODx.Component);
Ext.reg('fred-page-blueprint', fred.page.Blueprint);