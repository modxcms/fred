fred.page.Home = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        components: [
            {
                xtype: 'fred-panel-home',
                renderTo: 'fred-panel-home'
            }
        ]
    });
    fred.page.Home.superclass.constructor.call(this, config);
};
Ext.extend(fred.page.Home, MODx.Component);
Ext.reg('fred-page-home', fred.page.Home);