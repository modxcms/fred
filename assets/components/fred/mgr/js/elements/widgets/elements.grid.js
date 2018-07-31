fred.grid.Elements = function (config) {
    config = config || {};

    Ext.applyIf(config, {
        url: fred.config.connectorUrl,
        baseParams: {
            action: 'mgr/elements/getlist',
            sort: 'rank',
            dir: 'asc'
        },
        save_action: 'mgr/elements/updatefromgrid',
        autosave: true,
        preventSaveRefresh: false,
        fields: ['id', 'name', 'description', 'image', 'category', 'rank', 'category_name', 'option_set', 'content', 'has_override', 'option_set_name'],
        ddGroup: 'FredElementsDDGroup',
        enableDragDrop: true,
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
                        metaData.attr = 'ext:qtip=\'<img src=\"' + value + '\">\'';
                        return '<img src="' + value + '"  style="max-width:200px;max-height:100px;">';
                    }

                    return value;
                }
            },
            {
                header: _('fred.elements.name'),
                dataIndex: 'name',
                sortable: true,
                width: 80,
                editor: {xtype: 'textfield'}
            },
            {
                header: _('fred.elements.description'),
                dataIndex: 'description',
                width: 120
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
                width: 60
            },
            {
                header: _('fred.elements.has_override'),
                dataIndex: 'has_override',
                renderer: this.rendYesNo,
                width: 60
            },
            {
                header: _('fred.elements.rank'),
                dataIndex: 'rank',
                sortable: true,
                width: 40,
                editor: {
                    xtype: 'numberfield'
                }
            }
        ],
        tbar: [
            {
                text: _('fred.elements.create'),
                handler: this.newElement
            },
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
                xtype: 'fred-combo-element-categories',
                emptyText: _('fred.element_cateogries.all'),
                addAll: 1,
                filterName: 'category',
                listeners: {
                    select: this.filterCombo,
                    scope: this
                }
            }
        ]
    });
    fred.grid.Elements.superclass.constructor.call(this, config);

    this.on('render', this.registerGridDropTarget, this);
    this.on('beforedestroy', this.destroyScrollManager, this);
};
Ext.extend(fred.grid.Elements, MODx.grid.Grid, {

    getMenu: function () {
        var m = [];

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
        
        m.push('-');

        m.push({
            text: _('fred.elements.remove')
            , handler: this.removeTemplate
        });

        return m;
    },

    removeTemplate: function (btn, e) {
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
        s.baseParams[combo.filterName] = record.data[combo.valueField];
        this.getBottomToolbar().changePage(1);
    },

    search: function (field, value) {
        var s = this.getStore();
        s.baseParams.search = value;
        this.getBottomToolbar().changePage(1);
    },

    newElement: function(btn, e) {
        fred.loadPage('element/create');                 
    },

    quickUpdateElement: function (btn, e) {
        var updateElement = MODx.load({
            xtype: 'fred-window-element',
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

        updateElement.fp.getForm().reset();
        updateElement.fp.getForm().setValues(this.menu.record);
        updateElement.show(e.target);

        return true;
    },

    duplicateElement: function (btn, e) {
        var duplicateElement = MODx.load({
            xtype: 'fred-window-element-duplicate',
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
    }
});
Ext.reg('fred-grid-elements', fred.grid.Elements);
