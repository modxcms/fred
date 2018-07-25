fred.page.Elements = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        components: [
            {
                xtype: 'fred-panel-elements',
                renderTo: 'fred-panel-elements'
            }
        ]
    });
    fred.page.Elements.superclass.constructor.call(this, config);
};
Ext.extend(fred.page.Elements, MODx.Component);
Ext.reg('fred-page-elements', fred.page.Elements);