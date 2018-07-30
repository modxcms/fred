fred.panel.Elements = function (config) {
    config = config || {};
    Ext.apply(config, {
        border: false,
        baseCls: 'modx-formpanel',
        cls: 'container',
        items: [
            {
                html: '<h2>' + _('fred.elements.page_title') + '</h2>',
                border: false,
                cls: 'modx-page-header'
            },
            {
                xtype: 'modx-tabs',
                stateful: true,
                stateId: 'fred-tab-elements',
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
                        title: _('fred.elements.elements'),
                        items: [
                            {
                                xtype: 'fred-grid-elements',
                                preventRender: true,
                                cls: 'main-wrapper'
                            }
                        ]
                    },
                    {
                        title: _('fred.elements.categories'),
                        items: [
                            {
                                xtype: 'fred-grid-element-categories',
                                preventRender: true,
                                cls: 'main-wrapper'
                            }
                        ]
                    },
                    {
                        title: _('fred.elements.option_sets'),
                        items: [
                            {
                                xtype: 'fred-grid-element-option-sets',
                                preventRender: true,
                                cls: 'main-wrapper'
                            }
                        ]
                    },
                    {
                        title: _('fred.elements.rte_configs'),
                        items: [
                            {
                                xtype: 'fred-grid-element-rte-configs',
                                preventRender: true,
                                cls: 'main-wrapper'
                            }
                        ]
                    }
                ]
            }
        ]
    });
    fred.panel.Elements.superclass.constructor.call(this, config);
};
Ext.extend(fred.panel.Elements, MODx.Panel);
Ext.reg('fred-panel-elements', fred.panel.Elements);