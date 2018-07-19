fred.panel.Blueprints = function (config) {
    config = config || {};
    Ext.apply(config, {
        border: false,
        baseCls: 'modx-formpanel',
        cls: 'container',
        items: [
            {
                html: '<h2>' + _('fred.blueprints.page_title') + '</h2>',
                border: false,
                cls: 'modx-page-header'
            },
            {
                xtype: 'modx-tabs',
                stateful: true,
                stateId: 'fred-tab-blueprints',
                stateEvents: ['tabchange'],
                getState: function () {
                    return {
                        activeItem: this.items.indexOf(this.getActiveTab())
                    };
                },
                defaults: {
                    border: false,
                    autoHeight: true
                },
                border: true,
                activeItem: 0,
                hideMode: 'offsets',
                items: [
                    {
                        title: _('fred.blueprints.blueprints'),
                        items: [
                            {
                                xtype: 'fred-grid-blueprints',
                                preventRender: true,
                                cls: 'main-wrapper'
                            }
                        ]
                    },
                    {
                        title: _('fred.blueprints.categories'),
                        items: [
                            {
                                xtype: 'fred-grid-blueprint-categories',
                                preventRender: true,
                                cls: 'main-wrapper'
                            }
                        ]
                    }
                ]
            }
        ]
    });
    fred.panel.Blueprints.superclass.constructor.call(this, config);
};
Ext.extend(fred.panel.Blueprints, MODx.Panel);
Ext.reg('fred-panel-blueprints', fred.panel.Blueprints);