fred.page.ElementOptionSet = function (config) {
    config = config || {};

    config.isUpdate = (MODx.request.id) ? true : false;

    Ext.applyIf(config, {
        formpanel: 'fred-panel-element-option-set',
        buttons: [
            {
                text: _('save'),
                method: 'remote',
                process: config.isUpdate ? 'mgr/element_option_sets/update' : 'mgr/element_option_sets/create',
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
                    a: 'elements',
                    namespace: 'fred'
                }
            }
        ],
        components: [
            {
                xtype: 'fred-panel-element-option-set',
                isUpdate: config.isUpdate,
            }
        ]
    });
    fred.page.ElementOptionSet.superclass.constructor.call(this, config);
};
Ext.extend(fred.page.ElementOptionSet, MODx.Component);
Ext.reg('fred-page-element-option-set', fred.page.ElementOptionSet);