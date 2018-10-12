fred.grid.ElementCategories = function (config) {
    config = config || {};
    config.permission = config.permission || {};

    if (config.permission.fred_element_category_save) {
        config.ddGroup = 'FredElementCategoriesDDGroup';
        config.enableDragDrop = true;
        config.save_action = 'mgr/element_categories/updatefromgrid';
        config.autosave = true;
    }
    
    Ext.applyIf(config, {
        url: fred.config.connectorUrl,
        baseParams: {
            action: 'mgr/element_categories/getlist',
            sort: 'rank',
            dir: 'asc'
        },
        preventSaveRefresh: false,
        fields: ['id', 'name', 'rank', 'elements', 'theme_name', 'theme'],
        paging: true,
        remoteSort: true,
        emptyText: _('fred.element_categories.none'),
        columns: [
            {
                header: _('id'),
                dataIndex: 'id',
                sortable: true,
                hidden: true
            },
            {
                header: _('fred.element_categories.name'),
                dataIndex: 'name',
                sortable: true,
                width: 80,
                editor: this.getEditor(config, {xtype: 'textfield'})
            },
            {
                header: _('fred.element_categories.theme'),
                dataIndex: 'theme_name',
                sortable: true,
                width: 80
            },
            {
                header: _('fred.element_categories.number_of_elements'),
                dataIndex: 'elements',
                sortable: true,
                width: 80
            },
            {
                header: _('fred.element_categories.rank'),
                dataIndex: 'rank',
                sortable: true,
                width: 80,
                editor: this.getEditor(config, {xtype: 'numberfield'})
            }
        ],
        tbar: this.getTbar(config)
    });
    fred.grid.ElementCategories.superclass.constructor.call(this, config);

    this.on('render', this.registerGridDropTarget, this);
    this.on('beforedestroy', this.destroyScrollManager, this);
};
Ext.extend(fred.grid.ElementCategories, fred.grid.GearGrid, {
    getMenu: function () {
        var m = [];

        if (this.config.permission.fred_element_category_save) {
            m.push({
                text: _('fred.element_categories.update'),
                handler: this.updateCategory
            });

            m.push('-');

            m.push({
                text: _('fred.element_categories.duplicate'),
                handler: this.duplicateCategory
            });

            m.push('-');
        }
        
        m.push({
            text: _('fred.element_categories.remove'),
            handler: this.removeCategory
        });
        return m;
    },
    
    getTbar: function(config) {
        var output = [];

        if (config.permission.fred_element_category_save) {
            output.push({
                text: _('fred.element_categories.create'),
                handler: this.createCategory
            });
        }
        
        output.push([
            '->',
            {
                xtype: 'textfield',
                emptyText: _('fred.element_categories.search_name'),
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
                id: 'fred-element-category-filter-theme',
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
            xtype: 'fred-window-element-category',
            record: record,
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    },
                    scope: this
                }
            }
        });

        createCategory.fp.getForm().reset();
        createCategory.fp.getForm().setValues(record);
        createCategory.show(e.target);

        return true;
    },

    updateCategory: function (btn, e) {
        this.menu.record.theme_id = this.menu.record.theme;
        
        var updateCategory = MODx.load({
            xtype: 'fred-window-element-category',
            title: _('fred.element_categories.update'),
            action: 'mgr/element_categories/update',
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
    
    duplicateCategory: function (btn, e) {
        var duplicateCategory = MODx.load({
            xtype: 'fred-window-element-category-duplicate',
            title: _('fred.element_categories.duplicate'),
            action: 'mgr/element_categories/duplicate',
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

        duplicateCategory.fp.getForm().reset();
        duplicateCategory.fp.getForm().setValues(this.menu.record);
        duplicateCategory.show(e.target);

        return true;
    },

    removeCategory: function (btn, e) {
        if (!this.menu.record) return false;

        var elements = parseInt(this.menu.record.elements);
        var text;

        if (elements === 0) {
            text = _('fred.element_categories.remove_confirm_empty', {name: this.menu.record.name});
        } else if (elements === 1) {
            text = _('fred.element_categories.remove_confirm_singular', {name: this.menu.record.name, elements: elements});
        } else {
            text = _('fred.element_categories.remove_confirm', {name: this.menu.record.name, elements: elements});
        }

        MODx.msg.confirm({
            title: _('fred.element_categories.remove'),
            text: text,
            url: this.config.url,
            params: {
                action: 'mgr/element_categories/remove',
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
                            action: 'mgr/element_categories/ddreorder',
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
        if (config.permission.fred_element_category_save) return editor;

        return false;
    }
});
Ext.reg('fred-grid-element-categories', fred.grid.ElementCategories);