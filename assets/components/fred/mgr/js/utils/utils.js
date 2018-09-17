fred.button.Help = function (config) {
    config = config || {};
    config.path = config.path || '';
    
    var cfg = {
        text: _('fred.global.help'),
        handler: fred.getHelp(config.path),
    };
    
    fred.button.Help.superclass.constructor.call(this, cfg);

};
Ext.extend(fred.button.Help, Ext.Button);
Ext.reg('fred-button-help', fred.button.Help);