fred.grid.ElementRTEConfigs = function (config) {
    config = config || {};
    config.permission = config.permission || {};

    if (config.permission.fred_element_rte_config_save) {
        config.save_action = 'mgr/element_rte_configs/updatefromgrid';
        config.autosave = true;
    }

    if (!config.permission.fred_element_rte_config_save && !config.permission.fred_element_rte_config_delete) {
        config.showGear = false;
    }

    this.homePanel = config.homePanel;

    var baseParams = {
        action: 'mgr/element_rte_configs/getlist'
    };

    var initialThemeFilter = this.homePanel.state.get('fred-home-panel-filter-theme', '');
    if (initialThemeFilter) {
        baseParams.theme = initialThemeFilter;
    }

    Ext.applyIf(config, {
        url: fred.config.connectorUrl,
        baseParams: baseParams,
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
                editor: this.getEditor(config, {xtype: 'textfield'})
            },
            {
                header: _('fred.element_rte_configs.description'),
                dataIndex: 'description',
                width: 120,
                editor: this.getEditor(config, {xtype: 'textfield'})
            },
            {
                header: _('fred.element_rte_configs.theme'),
                dataIndex: 'theme_name',
                sortable: true,
                width: 80
            }
        ],
        tbar: this.getTbar(config)
    });
    fred.grid.ElementRTEConfigs.superclass.constructor.call(this, config);
};
Ext.extend(fred.grid.ElementRTEConfigs, fred.grid.GearGrid, {

    getMenu: function () {
        var m = [];

        if (this.config.permission.fred_element_rte_config_save) {
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
        }

        if (this.config.permission.fred_element_rte_config_delete) {
            if (m.length > 0) {
                m.push('-');
            }

            m.push({
                text: _('fred.element_rte_configs.remove')
                , handler: this.removeElementRTEConfig
            });
        }

        return m;
    },

    getTbar: function(config) {
        var output = [];

        if (config.permission.fred_element_rte_config_save) {
            output.push({
                text: _('fred.element_rte_configs.create'),
                handler: this.newElementRTEConfig
            });
        }

        output.push([
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
                value: this.homePanel.state.get('fred-home-panel-filter-theme', ''),
                syncFilter: function (combo, record) {
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
        ]);

        return output;
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
            this.homePanel.state.set('fred-home-panel-filter-theme', record.data[combo.valueField]);

            ids.forEach(function(id){
                if (id === combo.id) return true;

                var remoteCombo = Ext.getCmp(id);
                if (remoteCombo) {
                    remoteCombo.syncFilter(remoteCombo, record);
                }
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
    },

    getEditor: function(config, editor) {
        if (config.permission.fred_element_rte_config_save) return editor;

        return false;
    }
});
Ext.reg('fred-grid-element-rte-configs', fred.grid.ElementRTEConfigs);
