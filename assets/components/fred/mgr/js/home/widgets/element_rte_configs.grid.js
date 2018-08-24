fred.grid.ElementRTEConfigs = function (config) {
    config = config || {};

    Ext.applyIf(config, {
        url: fred.config.connectorUrl,
        baseParams: {
            action: 'mgr/element_rte_configs/getlist'
        },
        save_action: 'mgr/element_rte_configs/updatefromgrid',
        autosave: true,
        preventSaveRefresh: false,
        fields: ['id', 'name', 'description', 'complete', 'data', 'theme', 'theme_name'],
        paging: true,
        remoteSort: true,
        emptyText: _('fred.element_rte_configs.none'),
        columns: [
            {
                header: _('id'),
                dataIndex: 'id',
                sortable: true,
                hidden: true
            },
            {
                header: _('fred.element_rte_configs.name'),
                dataIndex: 'name',
                sortable: true,
                width: 80,
                editor: {xtype: 'textfield'}
            },
            {
                header: _('fred.element_rte_configs.description'),
                dataIndex: 'description',
                width: 120,
                editor: {xtype: 'textfield'}
            },
            {
                header: _('fred.element_rte_configs.theme'),
                dataIndex: 'theme_name',
                sortable: true,
                width: 80
            }
        ],
        tbar: [
            {
                text: _('fred.element_rte_configs.create'),
                handler: this.newElementRTEConfig
            },
            '->',
            {
                xtype: 'textfield',
                emptyText: _('fred.element_rte_configs.search_name'),
                listeners: {
                    'change': {
                        fn: this.search,
                        scope: this
                    },
                    'render': {
                        fn: function (cmp) {
                            new Ext.KeyMap(cmp.getEl(), {
                                key: Ext.EventObject.ENTER,
                                fn: function () {
                                    this.blur();
                                    return true;
                                },
                                scope: cmp
                            });
                        },
                        scope: this
                    }
                }
            },
            {
                id: 'fred-rte-config-filter-theme',
                xtype: 'fred-combo-themes',
                emptyText: _('fred.themes.all'),
                addAll: 1,
                isUpdate: true,
                filterName: 'theme',
                syncFilter: function(combo, record) {
                    combo.setValue(record.data[combo.valueField]);

                    var s = this.getStore();
                    s.baseParams[combo.filterName] = record.data[combo.valueField];

                    this.getBottomToolbar().changePage(1);
                }.bind(this),
                listeners: {
                    select: this.filterCombo,
                    scope: this
                }
            }
        ]
    });
    fred.grid.ElementRTEConfigs.superclass.constructor.call(this, config);
};
Ext.extend(fred.grid.ElementRTEConfigs, MODx.grid.Grid, {

    getMenu: function () {
        var m = [];

        m.push({
            text: _('fred.element_rte_configs.quick_update'),
            handler: this.quickUpdateElementRTEConfig
        });

        m.push({
            text: _('fred.element_rte_configs.update'),
            handler: this.updateElementRTEConfig
        });

        m.push('-');

        m.push({
            text: _('fred.element_rte_configs.duplicate'),
            handler: this.duplicateElementRTEConfig
        });
        
        m.push('-');

        m.push({
            text: _('fred.element_rte_configs.remove')
            , handler: this.removeElementRTEConfig
        });

        return m;
    },

    removeElementRTEConfig: function (btn, e) {
        if (!this.menu.record) return false;

        MODx.msg.confirm({
            title: _('fred.element_rte_configs.remove'),
            text: _('fred.element_rte_configs.remove_confirm', {name: this.menu.record.name}),
            url: this.config.url,
            params: {
                action: 'mgr/element_rte_configs/remove',
                id: this.menu.record.id
            },
            listeners: {
                'success': {
                    fn: function (r) {
                        this.refresh();
                    }, scope: this
                }
            }
        });

        return true;
    },

    filterCombo: function (combo, record) {
        var s = this.getStore();
        s.baseParams[combo.filterName] = record.data[combo.valueField];
        this.getBottomToolbar().changePage(1);

        if (combo.filterName === 'theme') {
            var ids = ['fred-element-filter-theme', 'fred-rte-config-filter-theme', 'fred-option-set-filter-theme', 'fred-element-category-filter-theme', 'fred-blueprint-filter-theme', 'fred-blueprint-category-filter-theme'];

            ids.forEach(function(id){
                if (id === combo.id) return true;

                var remoteCombo = Ext.getCmp(id);
                remoteCombo.syncFilter(remoteCombo, record);
            });
        }
    },

    search: function (field, value) {
        var s = this.getStore();
        s.baseParams.search = value;
        this.getBottomToolbar().changePage(1);
    },

    newElementRTEConfig: function(btn, e) {
        var options = {};

        var s = this.getStore();
        if (s.baseParams.theme) {
            options.theme = s.baseParams.theme;
        }
        
        fred.loadPage('element/rte_config/create', options);
    },

    quickUpdateElementRTEConfig: function (btn, e) {
        var updateElementRTEConfig = MODx.load({
            xtype: 'fred-window-element-rte-config',
            record: this.menu.record,
            isUpdate: true,
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    },
                    scope: this
                }
            }
        });

        updateElementRTEConfig.fp.getForm().reset();
        updateElementRTEConfig.fp.getForm().setValues(this.menu.record);
        updateElementRTEConfig.show(e.target);

        return true;
    },

    duplicateElementRTEConfig: function (btn, e) {
        var duplicateElementRTEConfig = MODx.load({
            xtype: 'fred-window-element-rte-config-duplicate',
            record: this.menu.record,
            isUpdate: true,
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    },
                    scope: this
                }
            }
        });

        duplicateElementRTEConfig.fp.getForm().reset();
        duplicateElementRTEConfig.fp.getForm().setValues(this.menu.record);
        duplicateElementRTEConfig.show(e.target);

        return true;
    },

    updateElementRTEConfig: function (btn, e) {
        fred.loadPage('element/rte_config/update', {id: this.menu.record.id});
    }
});
Ext.reg('fred-grid-element-rte-configs', fred.grid.ElementRTEConfigs);
