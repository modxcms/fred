fred.grid.Elements = function (config) {
    config = config || {};
    config.permission = config.permission || {};

    if (config.permission.fred_element_save) {
        config.ddGroup = 'FredElementsDDGroup';
        config.enableDragDrop = true;
        config.save_action = 'mgr/elements/updatefromgrid';
        config.autosave = true;
    }

    if (!config.permission.fred_element_save && !config.permission.fred_element_delete) {
        config.showGear = false;
    }

    this.homePanel = config.homePanel;

    var baseParams = {
        action: 'mgr/elements/getlist',
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
        fields: ['id', 'name', 'description', 'image', 'category', 'rank', 'category_name', 'option_set', 'content', 'has_override', 'option_set_name', 'theme_id', 'theme_name', 'theme_theme_folder'],
        paging: true,
        remoteSort: true,
        emptyText: _('fred.elements.none'),
        columns: [
            {
                header: _('id'),
                dataIndex: 'id',
                sortable: true,
                hidden: true
            },
            {
                header: _('fred.elements.image'),
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
                header: _('fred.elements.name'),
                dataIndex: 'name',
                sortable: true,
                width: 80,
                editor: this.getEditor(config, {xtype: 'textfield'})
            },
            {
                header: _('fred.elements.description'),
                dataIndex: 'description',
                width: 120,
                editor: {xtype: 'textfield'},
                hidden: document.body.clientWidth < 1550
            },
            {
                header: _('fred.elements.theme'),
                dataIndex: 'theme_name',
                sortable: true,
                width: 60
            },
            {
                header: _('fred.elements.category'),
                dataIndex: 'category_name',
                sortable: true,
                width: 60
            },
            {
                header: _('fred.elements.option_set'),
                dataIndex: 'option_set_name',
                width: 60,
                hidden: document.body.clientWidth < 1550
            },
            {
                header: _('fred.elements.has_override'),
                dataIndex: 'has_override',
                renderer: this.rendYesNo,
                width: 60,
                hidden: document.body.clientWidth < 1550
            },
            {
                header: _('fred.elements.rank'),
                dataIndex: 'rank',
                sortable: true,
                width: 40,
                editor: this.getEditor(config, {xtype: 'numberfield'})
            }
        ],
        tbar: this.getTbar(config)
    });
    fred.grid.Elements.superclass.constructor.call(this, config);

    this.on('render', this.registerGridDropTarget, this);
    this.on('beforedestroy', this.destroyScrollManager, this);

    fred.globalEvents.on('delete-element-category', function(category) {
        var categoryFilter = Ext.getCmp('fred-element-filter-category');

        if (categoryFilter.getValue() === category.id) {
            var record = categoryFilter.findRecord('id',0);
            categoryFilter.setValue(0);
            categoryFilter.fireEvent('select', categoryFilter, record);
        } else {
            this.getBottomToolbar().changePage(1);
        }
    }, this);

    fred.globalEvents.on('delete-theme', function(theme) {
        var themeFilter = Ext.getCmp('fred-element-filter-theme');

        if (themeFilter.getValue() !== theme.id) return;

        var record = themeFilter.findRecord('id',0);
        themeFilter.setValue(0);
        themeFilter.fireEvent('select', themeFilter, record);

        var categoryFilter = Ext.getCmp('fred-element-filter-category');
        var recordCategory = categoryFilter.findRecord('id',0);
        categoryFilter.setValue(0);
        categoryFilter.fireEvent('select', categoryFilter, recordCategory);
    }, this);
};
Ext.extend(fred.grid.Elements, fred.grid.GearGrid, {

    getMenu: function () {
        var m = [];

        if (this.config.permission.fred_element_save) {
            m.push({
                text: _('fred.elements.quick_update'),
                handler: this.quickUpdateElement
            });

            m.push({
                text: _('fred.elements.update'),
                handler: this.updateElement
            });

            m.push('-');

            m.push({
                text: _('fred.elements.duplicate'),
                handler: this.duplicateElement
            });
        }

        if (this.config.permission.fred_element_delete) {
            if (m.length > 0) {
                m.push('-');
            }

            m.push({
                text: _('fred.elements.remove')
                , handler: this.removeElement
            });
        }

        return m;
    },

    getTbar: function(config) {
        var output = [];

        if (config.permission.fred_element_save) {
            output.push({
                text: _('fred.elements.create'),
                handler: this.newElement
            });
        }

        output.push([[
            '->',
            {
                xtype: 'textfield',
                emptyText: _('fred.elements.search_name'),
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
                id: 'fred-element-filter-category',
                xtype: 'fred-combo-element-categories',
                emptyText: _('fred.element_cateogries.all'),
                addAll: 1,
                filterName: 'category',
                theme: this.homePanel.state.get('fred-home-panel-filter-theme', null),
                listeners: {
                    select: this.filterCombo,
                    scope: this
                }
            },
            {
                id: 'fred-element-filter-theme',
                xtype: 'fred-combo-themes',
                emptyText: _('fred.themes.all'),
                addAll: 1,
                isUpdate: true,
                filterName: 'theme',
                value: this.homePanel.state.get('fred-home-panel-filter-theme', ''),
                syncFilter: function(combo, record) {
                    var categoryFilter = Ext.getCmp('fred-element-filter-category');
                    var s = this.getStore();

                    if (record.data[combo.valueField] !== 0) {
                        s.baseParams.category = 0;
                        categoryFilter.setValue(0);
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
        ]]);

        return output;
    },

    removeElement: function (btn, e) {
        if (!this.menu.record) return false;

        MODx.msg.confirm({
            title: _('fred.elements.remove'),
            text: _('fred.elements.remove_confirm', {name: this.menu.record.name}),
            url: this.config.url,
            params: {
                action: 'mgr/elements/remove',
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

    newElement: function(btn, e) {
        var options = {};

        var s = this.getStore();
        if (s.baseParams.theme) {
            options.theme = s.baseParams.theme;

            if (s.baseParams.category) {
                options.category = s.baseParams.category;
            }
        }

        fred.loadPage('element/create', options);
    },

    quickUpdateElement: function (btn, e) {
        var updateElement = MODx.load({
            xtype: 'fred-window-element',
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

        var category = updateElement.find('name', 'category');
        if (category[0]) {
            category = category[0];
            category.baseParams.theme = this.menu.record.theme_id;
            category.lastQuery = null;
        }

        var optionSet = updateElement.find('name', 'option_set');
        if (optionSet[0]) {
            optionSet = optionSet[0];
            optionSet.baseParams.theme = this.menu.record.theme_id;
            optionSet.lastQuery = null;
        }

        updateElement.fp.getForm().reset();
        updateElement.fp.getForm().setValues(this.menu.record);
        updateElement.show(e.target);

        return true;
    },

    duplicateElement: function (btn, e) {
        var duplicateElement = MODx.load({
            xtype: 'fred-window-element-duplicate',
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

        var category = duplicateElement.find('name', 'category');
        if (category[0]) {
            category = category[0];
            category.baseParams.theme = this.menu.record.theme_id;
        }

        duplicateElement.fp.getForm().reset();
        duplicateElement.fp.getForm().setValues(this.menu.record);
        duplicateElement.show(e.target);

        return true;
    },

    updateElement: function (btn, e) {
        fred.loadPage('element/update', {id: this.menu.record.id});
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
                    var currentElement = records.pop();
                    MODx.Ajax.request({
                        url: fred.config.connectorUrl,
                        params: {
                            action: 'mgr/elements/ddreorder',
                            elementId: currentElement.id,
                            categoryId: currentElement.data.category,
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
        if (config.permission.fred_element_save) return editor;

        return false;
    }
});
Ext.reg('fred-grid-elements', fred.grid.Elements);
