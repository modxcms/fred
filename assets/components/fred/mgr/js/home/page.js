fred.page.Home = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        buttons: [
            {
                name: 'help',
                xtype: 'fred-button-help',
                path: this.getHelpPath
            }
        ],
        components: [
            {
                xtype: 'fred-panel-home',
                renderTo: 'fred-panel-home'
            }
        ]
    });
    fred.page.Home.superclass.constructor.call(this, config);
};
Ext.extend(fred.page.Home, MODx.Component, {
    getHelpPath: function() {
        var panel = Ext.getCmp('fred-home-panel');
        if (!panel) return '';
        
        return panel.getHelpPath();
    }
});
Ext.reg('fred-page-home', fred.page.Home);