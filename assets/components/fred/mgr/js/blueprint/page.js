fred.page.Blueprint = function (config) {
    config = config || {};
    config.permission = config.permission || {};

    config.isUpdate = !!MODx.request.id;

    Ext.applyIf(config, {
        formpanel: 'fred-panel-blueprint',
        buttons: [
            {
                text: _('save'),
                method: 'remote',
                process: 'Fred\\Processors\\Blueprints\\Update',
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
            },
            {
                xtype: 'fred-button-help',
                path: 'themer/cmp/blueprints/'
            }
        ],
        components: [
            {
                xtype: 'fred-panel-blueprint',
                isUpdate: config.isUpdate,
                permission: config.permission
            }
        ]
    });
    fred.page.Blueprint.superclass.constructor.call(this, config);
};
Ext.extend(fred.page.Blueprint, MODx.Component);
Ext.reg('fred-page-blueprint', fred.page.Blueprint);
