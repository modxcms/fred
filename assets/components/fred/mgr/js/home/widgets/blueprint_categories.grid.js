fred.grid.BlueprintCategories = function (config) {
    config = config || {};
    config.permission = config.permission || {};

    if (config.permission.fred_blueprint_categories_save) {
        config.save_action = 'Fred\\Processors\\BlueprintCategories\\UpdateFromGrid';
        config.autosave = true;
        config.ddGroup = 'FredBlueprintCategoriesDDGroup';
        config.enableDragDrop = true;
    }

    if (!config.permission.fred_blueprint_categories_save && !config.permission.fred_blueprint_categories_delete) {
        config.showGear = false;
    }

    this.homePanel = config.homePanel;

    var baseParams = {
        action: 'Fred\\Processors\\BlueprintCategories\\GetList',
        sort: 'rank',
        dir: 'asc'
    };

    var initialThemeFilter = this.homePanel.state.get('fred-home-panel-filter-theme', '');
    if (initialThemeFilter) {
        baseParams.theme = initialThemeFilter;
    }

    Ext.applyIf(config, {
        url: fred.config.connectorUrl,
        baseParams: baseParams,
        preventSaveRefresh: false,
        fields: ['id', 'uuid', 'name', 'rank', 'public', 'createdBy', 'user_profile_fullname', 'blueprints', 'theme', 'theme_name', 'templates'],
        paging: true,
        remoteSort: true,
        emptyText: _('fred.blueprint_categories.none'),
        columns: [
            {
                header: _('id'),
                dataIndex: 'id',
                sortable: true,
                hidden: true
            },
            {
                header: _('fred.global.uuid'),
                dataIndex: 'uuid',
                sortable: true,
                hidden: true
            },
            {
                header: _('fred.blueprint_categories.name'),
                dataIndex: 'name',
                sortable: true,
                width: 80,
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    return `<div class="fred-x-grid-cell-name">
                                <h3>${value}</h3>
                                <small>${_('fred.global.uuid')}: ${record.data.uuid}</small>
                            </div>`;

                },
                editor: this.getEditor(config, {xtype: 'textfield'})
            },
            {
                header: _('fred.blueprint_categories.theme'),
                dataIndex: 'theme_name',
                sortable: true,
                width: 80
            },
            {
                header: _('fred.blueprint_categories.public'),
                dataIndex: 'public',
                sortable: true,
                width: 80,
                editor: this.getPublicEditor(config, {
                    xtype: 'modx-combo-boolean',
                    renderer: this.rendYesNo
                }),
                renderer: this.rendYesNo
            },
            {
                header: _('fred.blueprint_categories.created_by'),
                dataIndex: 'user_profile_fullname',
                sortable: true,
                width: 80
            },
            {
                header: _('fred.blueprint_categories.number_of_blueprints'),
                dataIndex: 'blueprints',
                sortable: true,
                width: 80
            },
            {
                header: _('fred.blueprint_categories.rank'),
                dataIndex: 'rank',
                sortable: true,
                width: 80,
                editor: this.getEditor(config, {xtype: 'numberfield'})
            }
        ],
        tbar: this.getTbar(config)
    });
    fred.grid.BlueprintCategories.superclass.constructor.call(this, config);

    this.on('render', this.registerGridDropTarget, this);
    this.on('beforedestroy', this.destroyScrollManager, this);
};
Ext.extend(fred.grid.BlueprintCategories, MODx.grid.Grid, {
    getMenu: function () {
        var m = [];

        if (this.config.permission.fred_blueprint_categories_save) {
            m.push({
                text: _('fred.blueprint_categories.update'),
                handler: this.updateCategory
            });
        }

        if (this.config.permission.fred_blueprint_categories_delete) {
            if (m.length > 0) {
                m.push('-');
            }

            m.push({
                text: _('fred.blueprint_categories.remove'),
                handler: this.removeCategory
            });
        }

        return m;
    },

    getTbar: function(config) {
        var output = [];

        if (config.permission.fred_blueprint_categories_save) {
            output.push({
                text: _('fred.blueprint_categories.create'),
                handler: this.createCategory
            });
        }

        output.push([
            '->',
            {
                xtype: 'textfield',
                emptyText: _('fred.blueprint_categories.search_name'),
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
                dataLabel: _('fred.blueprint_categories.public'),
                emptyText: _('fred.blueprint_categories.public'),
                filterName: 'public',
                useInt: true,
                listeners: {
                    select: this.filterCombo,
                    scope: this
                }
            },
            {
                id: 'fred-blueprint-category-filter-theme',
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

    createCategory: function (btn, e) {
        var record = {};

        var s = this.getStore();
        if (s.baseParams.theme) {
            record.theme = s.baseParams.theme;
        }

        var createCategory = MODx.load({
            xtype: 'fred-window-blueprint-category',
            record: record,
            canPublic: this.config.permission.fred_blueprint_categories_create_public,
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    },
                    scope: this
                }
            }
        });

        createCategory.show(e.target);

        return true;
    },

    updateCategory: function (btn, e) {
        this.menu.record.theme_id = this.menu.record.theme;
        this.menu.record['templates[]'] = this.menu.record.templates;

        var updateCategory = MODx.load({
            xtype: 'fred-window-blueprint-category',
            canPublic: this.config.permission.fred_blueprint_categories_create_public,
            title: _('fred.blueprint_categories.update'),
            action: 'Fred\\Processors\\BlueprintCategories\\Update',
            isUpdate: true,
            record: this.menu.record,
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    },
                    scope: this
                }
            }
        });

        updateCategory.fp.getForm().setValues(this.menu.record);
        updateCategory.show(e.target);

        return true;
    },

    removeCategory: function (btn, e) {
        if (!this.menu.record) return false;

        var blueprints = parseInt(this.menu.record.blueprints);
        var text;

        if (blueprints === 0) {
            text = _('fred.blueprint_categories.remove_confirm_empty', {name: this.menu.record.name});
        } else if (blueprints === 1) {
            text = _('fred.blueprint_categories.remove_confirm_singular', {
                name: this.menu.record.name,
                blueprints: blueprints
            });
        } else {
            text = _('fred.blueprint_categories.remove_confirm', {name: this.menu.record.name, blueprints: blueprints});
        }

        MODx.msg.confirm({
            title: _('fred.blueprint_categories.remove'),
            text: text,
            url: this.config.url,
            params: {
                action: 'Fred\\Processors\\BlueprintCategories\\Remove',
                id: this.menu.record.id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        this.refresh();
                        fred.globalEvents.fireEvent('delete-blueprint-category', this.menu.record)
                    },
                    scope: this
                }
            }
        });

        return true;
    },

    search: function (field, value) {
        var s = this.getStore();
        s.baseParams.search = value;
        this.getBottomToolbar().changePage(1);
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

    isGridFiltered: function () {
        var search = this.getStore().baseParams.search;
        if (search && search != '') {
            return true;
        }

        var publicFilter = this.getStore().baseParams.public;
        if ((publicFilter !== undefined) && (publicFilter !== null) && (publicFilter !== '')) {
            return true;
        }

        var themeFilter = this.getStore().baseParams.theme;
        if (!((themeFilter !== undefined) && (themeFilter !== null) && (themeFilter !== '') && (themeFilter !== 0))) {
            return true;
        }

        return false;
    },

    getDragDropText: function () {
        if (this.store.sortInfo && this.store.sortInfo.field != 'rank') {
            return _('fred.err.bad_sort_column', {column: 'rank'});
        }

        var themeFilter = this.getStore().baseParams.theme;
        if (!((themeFilter !== undefined) && (themeFilter !== null) && (themeFilter !== '') && (themeFilter !== 0))) {
            return _('fred.err.required_filter', {filter: 'theme'});
        }

        if (this.isGridFiltered()) {
            return _('fred.err.clear_filter');
        }

        return _('fred.global.change_order', {name: this.selModel.selections.items[0].data.name});
    },

    registerGridDropTarget: function () {

        var ddrow = new Ext.ux.dd.GridReorderDropTarget(this, {
            copy: false,
            sortCol: 'rank',
            isGridFiltered: this.isGridFiltered.bind(this),
            listeners: {
                'beforerowmove': function (objThis, oldIndex, newIndex, records) {
                },

                'afterrowmove': function (objThis, oldIndex, newIndex, records) {
                    var currentElement = records.pop();

                    MODx.Ajax.request({
                        url: fred.config.connectorUrl,
                        params: {
                            action: 'mgr/blueprint_categories/ddreorder',
                            categoryId: currentElement.id,
                            themeId: currentElement.data.theme,
                            oldIndex: oldIndex,
                            newIndex: newIndex
                        },
                        listeners: {
                            'success': {
                                fn: function (r) {
                                    this.target.grid.refresh();
                                },
                                scope: this
                            }
                        }
                    });
                },

                'beforerowcopy': function (objThis, oldIndex, newIndex, records) {
                },

                'afterrowcopy': function (objThis, oldIndex, newIndex, records) {
                }
            }
        });

        Ext.dd.ScrollManager.register(this.getView().getEditorParent());
    },

    destroyScrollManager: function () {
        Ext.dd.ScrollManager.unregister(this.getView().getEditorParent());
    },

    getEditor: function(config, editor) {
        if (config.permission.fred_blueprint_categories_save) return editor;

        return false;
    },

    getPublicEditor: function(config, editor) {
        if (!config.permission.fred_blueprint_categories_save) return false;
        if (!config.permission.fred_blueprint_categories_create_public) return false;

        return editor;
    }
});
Ext.reg('fred-grid-blueprint-categories', fred.grid.BlueprintCategories);
