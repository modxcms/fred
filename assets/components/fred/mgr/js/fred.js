var Fred = function (config) {
    config = config || {};
    Fred.superclass.constructor.call(this, config);
};
Ext.extend(Fred, Ext.Component, {
    page: {},
    window: {},
    grid: {},
    tree: {},
    panel: {},
    combo: {},
    config: {},
    loadPage: function (action, parameters) {
        if (!parameters) {
            parameters = 'namespace=fred';
        } else {
            if (typeof parameters === 'object') {
                var stringParams = [];

                for (var key in parameters) {
                    if (parameters.hasOwnProperty(key)) {
                        stringParams.push(key + '=' + parameters[key]);
                    }
                }

                parameters = stringParams.join('&');
            }
            parameters += '&namespace=fred';
        }

        MODx.loadPage(action, parameters);
    }
});
Ext.reg('fred', Fred);
fred = new Fred();