fred.grid.Blueprints = function (config) {
    config = config || {};
    config.permission = config.permission || {};

    if (config.permission.fred_blueprints_save) {
        config.save_action = 'Fred\\Processors\\Blueprints\\UpdateFromGrid';
        config.autosave = true;
        config.ddGroup = 'FredBlueprintsDDGroup';
        config.enableDragDrop = true;
    }

    if (!config.permission.fred_blueprints_save && !config.permission.fred_blueprints_delete) {
        config.showGear = false;
    }

    this.homePanel = config.homePanel;

    var baseParams = {
        action: 'Fred\\Processors\\Blueprints\\GetList',
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
        fields: ['id', 'uuid', 'name', 'description', 'image', 'category', 'rank', 'complete', 'public', 'createdBy', 'category_name', 'user_profile_fullname', 'theme_id', 'theme_name', 'theme_theme_folder', 'theme_settingsPrefix'],
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
                header: _('fred.global.uuid'),
                dataIndex: 'uuid',
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
                        value = fred.prependBaseUrl(value, record.data.theme_settingsPrefix);

                        metaData.attr = 'ext:qtip=\'<img src=\"' + value + '\">\'';
                        return '<img src="' + value + '"  style="max-width:100%;max-height:150px;object-fit:contain;" width="350" height="150">';
                    }

                    return value;
                }
            },
            {
                header: _('fred.blueprints.name'),
                dataIndex: 'name',
                sortable: true,
                width: 70,
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    return `<div class="fred-x-grid-cell-name">
                                <h3><a href="?a=blueprint/update&namespace=fred&id=${record.data.id}"${value}</a></h3>
                                <small>${_('fred.global.uuid')}: ${record.data.uuid}</small>
                                <small>${record.data.description}</small>
                            </div>`;

                },
                editor: this.getEditor(config, {xtype: 'textfield'})
            },
            {
                header: _('fred.blueprints.description'),
                dataIndex: 'description',
                width: 100,
                hidden: true
            },
            {
                header: _('fred.blueprints.theme'),
                dataIndex: 'theme_name',
                sortable: true,
                width: 50
            },
            {
                header: _('fred.blueprints.category'),
                dataIndex: 'category_name',
                sortable: true,
                width: 50
            },
            {
                header: _('fred.blueprints.complete'),
                dataIndex: 'complete',
                sortable: true,
                width: 40,
                renderer: this.rendYesNo
            },
            {
                header: _('fred.blueprints.public'),
                dataIndex: 'public',
                sortable: true,
                width: 40,
                editor: this.getPublicEditor(config, {
                    xtype: 'modx-combo-boolean',
                    renderer: this.rendYesNo
                }),
                renderer: this.rendYesNo
            },
            {
                header: _('fred.blueprints.created_by'),
                dataIndex: 'user_profile_fullname',
                sortable: true,
                width: 40,
                hidden: document.body.clientWidth < 1550
            },
            {
                header: _('fred.blueprints.rank'),
                dataIndex: 'rank',
                sortable: true,
                width: 30,
                editor: this.getEditor(config, {xtype: 'numberfield'})
            }
        ],
        tbar: this.getTbar(config)
    });
    fred.grid.Blueprints.superclass.constructor.call(this, config);

    this.on('render', this.registerGridDropTarget, this);
    this.on('beforedestroy', this.destroyScrollManager, this);

    fred.globalEvents.on('delete-blueprint-category', function(category) {
        var categoryFilter = Ext.getCmp('fred-blueprint-filter-category');

        if (categoryFilter.getValue() === category.id) {
            var record = categoryFilter.findRecord('id',0);
            categoryFilter.setValue(0);
            categoryFilter.fireEvent('select', categoryFilter, record);
        } else {
            this.getBottomToolbar().changePage(1);
        }
    }, this);

    fred.globalEvents.on('delete-theme', function(theme) {
        var categoryFilter = Ext.getCmp('fred-blueprint-filter-category');
        var recordCategory = categoryFilter.findRecord('id',0);
        categoryFilter.setValue(0);
        categoryFilter.fireEvent('select', categoryFilter, recordCategory);
    }, this);
};
Ext.extend(fred.grid.Blueprints, MODx.grid.Grid, {

    getMenu: function () {
        var m = [];

        if (this.config.permission.fred_blueprints_save) {
            m.push({
                text: _('fred.blueprints.quick_update'),
                handler: this.quickUpdateBlueprint
            });

            m.push({
                text: _('fred.blueprints.update'),
                handler: this.updateBlueprint
            });
        }

        if (this.config.permission.fred_blueprints_delete) {
            if (m.length > 0) {
                m.push('-');
            }

            m.push({
                text: _('fred.blueprints.remove')
                , handler: this.removeBlueprint
            });
        }

        return m;
    },

    getTbar: function(config) {
        return [
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
                theme: this.homePanel.state.get('fred-home-panel-filter-theme', null),
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
                value: this.homePanel.state.get('fred-home-panel-filter-theme', ''),
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
        ];
    },

    removeBlueprint: function (btn, e) {
        if (!this.menu.record) return false;

        MODx.msg.confirm({
            title: _('fred.blueprints.remove'),
            text: _('fred.blueprints.remove_confirm', {name: this.menu.record.name}),
            url: this.config.url,
            params: {
                action: 'Fred\\Processors\\Blueprints\\Remove',
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
        var categoryFilter = Ext.getCmp('fred-blueprint-filter-category');

        if (!record) {
            s.baseParams.category = 0;
            categoryFilter.setValue();
            return;
        }

        s.baseParams[combo.filterName] = record.data[combo.valueField];

        if (combo.filterName === 'theme') {
            this.homePanel.state.set('fred-home-panel-filter-theme', record.data[combo.valueField]);

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
                if (remoteCombo) {
                    remoteCombo.syncFilter(remoteCombo, record);
                }
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
            canPublic: this.config.permission.fred_blueprints_create_public,
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
    },

    getEditor: function(config, editor) {
        if (config.permission.fred_blueprints_save) return editor;

        return false;
    },

    getPublicEditor: function(config, editor) {
        if (!config.permission.fred_blueprints_save) return false;
        if (!config.permission.fred_blueprints_create_public) return false;

        return editor;
    }
});
Ext.reg('fred-grid-blueprints', fred.grid.Blueprints);
