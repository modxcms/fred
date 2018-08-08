fred.page.ElementRTEConfig = function (config) {
    config = config || {};

    config.isUpdate = (MODx.request.id) ? true : false;

    Ext.applyIf(config, {
        formpanel: 'fred-panel-element-rte-config',
        buttons: [
            {
                text: _('save'),
                method: 'remote',
                process: config.isUpdate ? 'mgr/element_rte_configs/update' : 'mgr/element_rte_configs/create',
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
                xtype: 'fred-panel-element-rte-config',
                isUpdate: config.isUpdate,
            }
        ]
    });
    fred.page.ElementRTEConfig.superclass.constructor.call(this, config);
};
Ext.extend(fred.page.ElementRTEConfig, MODx.Component);
Ext.reg('fred-page-element-rte-config', fred.page.ElementRTEConfig);