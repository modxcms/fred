fred.page.Blueprints = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        components: [
            {
                xtype: 'fred-panel-blueprints',
                renderTo: 'fred-panel-blueprints'
            }
        ]
    });
    fred.page.Blueprints.superclass.constructor.call(this, config);
};
Ext.extend(fred.page.Blueprints, MODx.Component);
Ext.reg('fred-page-blueprints', fred.page.Blueprints);