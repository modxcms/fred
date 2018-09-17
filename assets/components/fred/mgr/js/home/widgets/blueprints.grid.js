fred.grid.Blueprints = function (config) {
    config = config || {};

    Ext.applyIf(config, {
        url: fred.config.connectorUrl,
        baseParams: {
            action: 'mgr/blueprints/getlist',
            sort: 'rank',
            dir: 'asc'
        },
        save_action: 'mgr/blueprints/updatefromgrid',
        autosave: true,
        preventSaveRefresh: false,
        fields: ['id', 'name', 'description', 'image', 'category', 'rank', 'complete', 'public', 'createdBy', 'category_name', 'user_profile_fullname', 'theme_id', 'theme_name', 'theme_theme_folder'],
        ddGroup: 'FredBlueprintsDDGroup',
        enableDragDrop: true,
        paging: true,
        remoteSort: true,
        emptyText: _('fred.blueprints.none'),
        columns: [
            {
                header: _('id'),
                dataIndex: 'id',
                sortable: true,
                hidden: true
            },
            {
                header: _('fred.blueprints.image'),
                dataIndex: 'image',
                sortable: false,
                width: 80,
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    if (value) {
                        value = fred.prependBaseUrl(value, record.data.theme_theme_folder);
                        
                        metaData.attr = 'ext:qtip=\'<img src=\"' + value + '\">\'';
                        return '<img src="' + value + '"  style="max-width:200px;max-height:150px;">';
                    }

                    return value;
                }
            },
            {
                header: _('fred.blueprints.name'),
                dataIndex: 'name',
                sortable: true,
                width: 80,
                editor: {xtype: 'textfield'}
            },
            {
                header: _('fred.blueprints.description'),
                dataIndex: 'description',
                width: 120
            },
            {
                header: _('fred.blueprints.theme'),
                dataIndex: 'theme_name',
                sortable: true,
                width: 60
            },
            {
                header: _('fred.blueprints.category'),
                dataIndex: 'category_name',
                sortable: true,
                width: 60
            },
            {
                header: _('fred.blueprints.complete'),
                dataIndex: 'complete',
                sortable: true,
                width: 30,
                renderer: this.rendYesNo
            },
            {
                header: _('fred.blueprints.public'),
                dataIndex: 'public',
                sortable: true,
                width: 30,
                editor: {
                    xtype: 'modx-combo-boolean',
                    renderer: this.rendYesNo
                },
                renderer: this.rendYesNo
            },
            {
                header: _('fred.blueprints.created_by'),
                dataIndex: 'user_profile_fullname',
                sortable: true,
                width: 40
            },
            {
                header: _('fred.blueprints.rank'),
                dataIndex: 'rank',
                sortable: true,
                width: 40,
                editor: {
                    xtype: 'numberfield'
                }
            }
        ],
        tbar: [
            '->',
            {
                xtype: 'textfield',
                emptyText: _('fred.blueprints.search_name'),
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
                dataLabel: _('fred.blueprints.public'),
                emptyText: _('fred.blueprints.public'),
                filterName: 'public',
                useInt: true,
                listeners: {
                    select: this.filterCombo,
                    scope: this
                }
            },
            {
                xtype: 'fred-combo-extended-boolean',
                dataLabel: _('fred.blueprints.complete'),
                emptyText: _('fred.blueprints.complete'),
                filterName: 'complete',
                useInt: true,
                listeners: {
                    select: this.filterCombo,
                    scope: this
                }
            },
            {
                id: 'fred-blueprint-filter-category',
                xtype: 'fred-combo-blueprint-categories',
                emptyText: _('fred.blueprint_cateogries.all'),
                addAll: 1,
                filterName: 'category',
                listeners: {
                    select: this.filterCombo,
                    scope: this
                }
            },
            {
                id: 'fred-blueprint-filter-theme',
                xtype: 'fred-combo-themes',
                emptyText: _('fred.themes.all'),
                addAll: 1,
                isUpdate: true,
                filterName: 'theme',
                syncFilter: function(combo, record) {
                    var categoryFilter = Ext.getCmp('fred-blueprint-filter-category');
                    var s = this.getStore();

                    if (record.data[combo.valueField] !== 0) {
                        s.baseParams.category = 0;
                        categoryFilter.setValue();
                    }

                    categoryFilter.baseParams.theme = record.data[combo.valueField];
                    categoryFilter.store.load();

                    combo.setValue(record.data[combo.valueField]);

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
    fred.grid.Blueprints.superclass.constructor.call(this, config);

    this.on('render', this.registerGridDropTarget, this);
    this.on('beforedestroy', this.destroyScrollManager, this);
};
Ext.extend(fred.grid.Blueprints, MODx.grid.Grid, {

    getMenu: function () {
        var m = [];

        m.push({
            text: _('fred.blueprints.quick_update'),
            handler: this.quickUpdateBlueprint
        });

        m.push({
            text: _('fred.blueprints.update'),
            handler: this.updateBlueprint
        });

        m.push('-');

        m.push({
            text: _('fred.blueprints.remove')
            , handler: this.removeBlueprint
        });

        return m;
    },

    removeBlueprint: function (btn, e) {
        if (!this.menu.record) return false;

        MODx.msg.confirm({
            title: _('fred.blueprints.remove'),
            text: _('fred.blueprints.remove_confirm', {name: this.menu.record.name}),
            url: this.config.url,
            params: {
                action: 'mgr/blueprints/remove',
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

        if (combo.filterName === 'theme') {
            var categoryFilter = Ext.getCmp('fred-blueprint-filter-category');

            if (record.data[combo.valueField] !== 0) {
                s.baseParams.category = 0;
                categoryFilter.setValue();
            }

            categoryFilter.baseParams.theme = record.data[combo.valueField];
            categoryFilter.store.load();

            var ids = ['fred-element-filter-theme', 'fred-rte-config-filter-theme', 'fred-option-set-filter-theme', 'fred-element-category-filter-theme', 'fred-blueprint-filter-theme', 'fred-blueprint-category-filter-theme'];

            ids.forEach(function(id){
                if (id === combo.id) return true;

                var remoteCombo = Ext.getCmp(id);
                remoteCombo.syncFilter(remoteCombo, record);
            });
        }

        this.getBottomToolbar().changePage(1);
    },

    search: function (field, value) {
        var s = this.getStore();
        s.baseParams.search = value;
        this.getBottomToolbar().changePage(1);
    },

    quickUpdateBlueprint: function (btn, e) {
        var quickUpdateBlueprint = MODx.load({
            xtype: 'fred-window-blueprint',
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

        quickUpdateBlueprint.fp.getForm().reset();
        quickUpdateBlueprint.fp.getForm().setValues(this.menu.record);
        quickUpdateBlueprint.show(e.target);

        return true;
    },

    updateBlueprint: function (btn, e) {
        fred.loadPage('blueprint/update', {id: this.menu.record.id});
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

        var completeFilter = this.getStore().baseParams.complete;
        if ((completeFilter !== undefined) && (completeFilter !== null) && (completeFilter !== '')) {
            return true;
        }

        var categoryFilter = this.getStore().baseParams.category;
        if (!((categoryFilter !== undefined) && (categoryFilter !== null) && (categoryFilter !== '') && (categoryFilter !== 0))) {
            return true;
        }

        return false;
    },

    getDragDropText: function () {
        if (this.store.sortInfo && this.store.sortInfo.field != 'rank') {
            return _('fred.err.bad_sort_column', {column: 'rank'});
        }

        var categoryFilter = this.getStore().baseParams.category;
        if (!((categoryFilter !== undefined) && (categoryFilter !== null) && (categoryFilter !== '') && (categoryFilter !== 0))) {
            return _('fred.err.required_filter', {filter: 'category'});
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
                    var currentBlueprint = records.pop();
                    MODx.Ajax.request({
                        url: fred.config.connectorUrl,
                        params: {
                            action: 'mgr/blueprints/ddreorder',
                            blueprintId: currentBlueprint.id,
                            categoryId: currentBlueprint.data.category,
                            oldIndex: oldIndex,
                            newIndex: newIndex
                        },
                        listeners: {
                            success: {
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
Ext.reg('fred-grid-blueprints', fred.grid.Blueprints);
