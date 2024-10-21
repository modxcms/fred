fred.grid.ElementOptionSets = function (config) {
    config = config || {};
    config.permission = config.permission || {};

    if (config.permission.fred_element_option_sets_save) {
        config.save_action = 'Fred\\Processors\\ElementOptionSets\\UpdateFromGrid';
        config.autosave = true;
    }

    if (!config.permission.fred_element_option_sets_save && !config.permission.fred_element_option_sets_delete) {
        config.showGear = false;
    }

    this.homePanel = config.homePanel;

    var baseParams = {
        action: 'Fred\\Processors\\ElementOptionSets\\GetList'
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
        emptyText: _('fred.element_option_sets.none'),
        columns: [
            {
                header: _('id'),
                dataIndex: 'id',
                sortable: true,
                hidden: true
            },
            {
                header: _('fred.element_option_sets.name'),
                dataIndex: 'name',
                sortable: true,
                width: 80,
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    return `<div class="fred-x-grid-cell-name">
                                <h3><a href="?a=element/option_set/update&namespace=fred&id=${record.data.id}">${value}</a></h3>
                                <small>${record.data.description}</small>
                            </div>`;

                },
                editor: this.getEditor(config, {xtype: 'textfield'})
            },
            {
                header: _('fred.element_option_sets.description'),
                dataIndex: 'description',
                width: 100,
                hidden: true,
                editor: this.getEditor(config, {xtype: 'textfield'})
            },
            {
                header: _('fred.element_option_sets.theme'),
                dataIndex: 'theme_name',
                sortable: true,
                width: 60
            },
            {
                header: _('fred.element_option_sets.complete'),
                dataIndex: 'complete',
                sortable: true,
                width: 40,
                renderer: this.rendYesNo
            }
        ],
        tbar: this.getTbar(config)
    });
    fred.grid.ElementOptionSets.superclass.constructor.call(this, config);
};
Ext.extend(fred.grid.ElementOptionSets, MODx.grid.Grid, {

    getMenu: function () {
        var m = [];

        if (this.config.permission.fred_element_option_sets_save) {
            m.push({
                text: _('fred.element_option_sets.quick_update'),
                handler: this.quickUpdateElementOptionSet
            });

            m.push({
                text: _('fred.element_option_sets.update'),
                handler: this.updateElementOptionSet
            });

            m.push('-');

            m.push({
                text: _('fred.element_option_sets.duplicate'),
                handler: this.duplicateElementOptionSet
            });
        }

        if (this.config.permission.fred_element_option_sets_delete) {
            if (m.length > 0) {
                m.push('-');
            }

            m.push({
                text: _('fred.element_option_sets.remove'),
                handler: this.removeElementOptionSet
            });
        }

        return m;
    },

    getTbar: function(config) {
        var output = [];

        if (config.permission.fred_element_option_sets_save) {
            output.push({
                text: _('fred.element_option_sets.create'),
                handler: this.createElementOptionSet
            });
        }

        output.push([
            '->',
            {
                xtype: 'textfield',
                emptyText: _('fred.element_option_sets.search_name'),
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
                xtype: 'fred-combo-extended-boolean',
                dataLabel: _('fred.element_option_sets.complete'),
                emptyText: _('fred.element_option_sets.complete'),
                filterName: 'complete',
                useInt: true,
                listeners: {
                    select: this.filterCombo,
                    scope: this
                }
            },
            {
                id: 'fred-option-set-filter-theme',
                xtype: 'fred-combo-themes',
                emptyText: _('fred.themes.all'),
                addAll: 1,
                isUpdate: true,
                filterName: 'theme',
                value: this.homePanel.state.get('fred-home-panel-filter-theme', ''),
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
        ]);

        return output;
    },

    removeElementOptionSet: function (btn, e) {
        if (!this.menu.record) return false;

        MODx.msg.confirm({
            title: _('fred.element_option_sets.remove'),
            text: _('fred.element_option_sets.remove_confirm', {name: this.menu.record.name}),
            url: this.config.url,
            params: {
                action: 'Fred\\Processors\\ElementOptionSets\\Remove',
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

    createElementOptionSet: function(btn, e) {
        var options = {};

        var s = this.getStore();
        if (s.baseParams.theme) {
            options.theme = s.baseParams.theme;
        }

        fred.loadPage('element/option_set/create', options);
    },

    quickUpdateElementOptionSet: function (btn, e) {
        var updateElementOptionSet = MODx.load({
            xtype: 'fred-window-element-option-set',
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

        updateElementOptionSet.fp.getForm().reset();
        updateElementOptionSet.fp.getForm().setValues(this.menu.record);
        updateElementOptionSet.show(e.target);

        return true;
    },

    duplicateElementOptionSet: function (btn, e) {
        var duplicateElementOptionSet = MODx.load({
            xtype: 'fred-window-element-option-set-duplicate',
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

        duplicateElementOptionSet.fp.getForm().reset();
        duplicateElementOptionSet.fp.getForm().setValues(this.menu.record);
        duplicateElementOptionSet.show(e.target);

        return true;
    },

    updateElementOptionSet: function (btn, e) {
        fred.loadPage('element/option_set/update', {id: this.menu.record.id});
    },

    getEditor: function(config, editor) {
        if (config.permission.fred_element_option_sets_save) return editor;

        return false;
    }
});
Ext.reg('fred-grid-element-option-sets', fred.grid.ElementOptionSets);
