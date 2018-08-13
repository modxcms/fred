fred.grid.BlueprintCategories = function (config) {
    config = config || {};

    Ext.applyIf(config, {
        url: fred.config.connectorUrl,
        baseParams: {
            action: 'mgr/blueprint_categories/getlist',
            sort: 'rank',
            dir: 'asc'
        },
        save_action: 'mgr/blueprint_categories/updatefromgrid',
        autosave: true,
        preventSaveRefresh: false,
        fields: ['id', 'name', 'rank', 'public', 'createdBy', 'user_profile_fullname', 'blueprints', 'theme', 'theme_name'],
        ddGroup: 'FredBlueprintCategoriesDDGroup',
        enableDragDrop: true,
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
                header: _('fred.blueprint_categories.name'),
                dataIndex: 'name',
                sortable: true,
                width: 80,
                editor: {xtype: 'textfield'}
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
                editor: {
                    xtype: 'modx-combo-boolean',
                    renderer: this.rendYesNo
                },
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
                editor: {xtype: 'numberfield'}
            }
        ],
        tbar: [
            {
                text: _('fred.blueprint_categories.create'),
                handler: this.createTheme
            },
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
    fred.grid.BlueprintCategories.superclass.constructor.call(this, config);

    this.on('render', this.registerGridDropTarget, this);
    this.on('beforedestroy', this.destroyScrollManager, this);
};
Ext.extend(fred.grid.BlueprintCategories, MODx.grid.Grid, {
    getMenu: function () {
        var m = [];

        m.push({
            text: _('fred.blueprint_categories.update'),
            handler: this.updateTheme
        });

        m.push('-');

        m.push({
            text: _('fred.blueprint_categories.remove'),
            handler: this.removeTheme
        });
        return m;
    },

    createTheme: function (btn, e) {
        var createCategory = MODx.load({
            xtype: 'fred-window-blueprint-category',
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

    updateTheme: function (btn, e) {
        var updateCategory = MODx.load({
            xtype: 'fred-window-blueprint-category',
            title: _('fred.blueprint_categories.update'),
            action: 'mgr/blueprint_categories/update',
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

        updateCategory.fp.getForm().reset();
        updateCategory.fp.getForm().setValues(this.menu.record);
        updateCategory.show(e.target);

        return true;
    },

    removeTheme: function (btn, e) {
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
                action: 'mgr/blueprint_categories/remove',
                id: this.menu.record.id
            },
            listeners: {
                success: {
                    fn: function (r) {
                        this.refresh();
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

            ids.forEach(function(id){
                if (id === combo.id) return true;

                var remoteCombo = Ext.getCmp(id);
                remoteCombo.syncFilter(remoteCombo, record);
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
    }
});
Ext.reg('fred-grid-blueprint-categories', fred.grid.BlueprintCategories);