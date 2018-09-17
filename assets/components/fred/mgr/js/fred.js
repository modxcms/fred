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
    button: {},
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
    },
    
    prependBaseUrl: function(url) {
        url = url.replace('{{assets_url}}', MODx.config.assets_url);
        
        if ((url.substr(0,7).toLowerCase() !== 'http://') && (url.substr(0,8).toLowerCase() !== 'https://') && (url.substr(0,2).toLowerCase() !== '//')  && (url.substr(0,1).toLowerCase() !== '/')) {
            url = MODx.config.base_url + url;
        }
        
        return url;
    },

    getPageUrl: function(action, parameters) {
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
        
        // Handles url, passed as first argument
        var parts = [];
        if (action) {
            if (isNaN(parseInt(action)) && (action.substr(0, 1) == '?' || (action.substr(0, "index.php?".length) == 'index.php?'))) {
                parts.push(action);
            } else {
                parts.push('?a=' + action);
            }
        }

        if (parameters) {
            parts.push(parameters);
        }

        return parts.join('&');
    },
    
    getHelp: function(path = '', handler = true) {
        if (handler === true) {
            return function() {
                var win = window.open('https://modxcms.github.io/fred/' + path, '_blank');
                win.focus();
            };       
        } else {
            var win = window.open('https://modxcms.github.io/fred/' + path, '_blank');
            win.focus();
        }
    }
});
Ext.reg('fred', Fred);
fred = new Fred();