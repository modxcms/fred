var Fred = function (config) {
    config = config || {};
    Fred.superclass.constructor.call(this, config);
};
Ext.extend(Fred, Ext.Component, {
    page: {}, window: {}, grid: {}, tree: {}, panel: {}, combo: {}, config: {}
});
Ext.reg('fred', Fred);
fred = new Fred();