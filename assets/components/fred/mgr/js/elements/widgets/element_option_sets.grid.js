fred.grid.ElementOptionSets = function (config) {
    config = config || {};

    Ext.applyIf(config, {
        url: fred.config.connectorUrl,
        baseParams: {
            action: 'mgr/element_option_sets/getlist'
        },
        save_action: 'mgr/element_option_sets/updatefromgrid',
        autosave: true,
        preventSaveRefresh: false,
        fields: ['id', 'name', 'description', 'complete', 'data'],
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
                editor: {xtype: 'textfield'}
            },
            {
                header: _('fred.element_option_sets.description'),
                dataIndex: 'description',
                width: 120
            },
            {
                header: _('fred.element_option_sets.complete'),
                dataIndex: 'complete',
                sortable: true,
                width: 30,
                renderer: this.rendYesNo
            }
        ],
        tbar: [
            {
                text: _('fred.element_option_sets.create'),
                handler: this.newElementRTEConfig
            },
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
            }
        ]
    });
    fred.grid.ElementOptionSets.superclass.constructor.call(this, config);
};
Ext.extend(fred.grid.ElementOptionSets, MODx.grid.Grid, {

    getMenu: function () {
        var m = [];

        m.push({
            text: _('fred.element_option_sets.quick_update'),
            handler: this.quickUpdateElementRTEConfig
        });

        m.push({
            text: _('fred.element_option_sets.update'),
            handler: this.updateElementRTEConfig
        });

        m.push('-');

        m.push({
            text: _('fred.element_option_sets.remove')
            , handler: this.removeElementRTEConfig
        });

        return m;
    },

    removeElementRTEConfig: function (btn, e) {
        if (!this.menu.record) return false;

        MODx.msg.confirm({
            title: _('fred.element_option_sets.remove'),
            text: _('fred.element_option_sets.remove_confirm', {name: this.menu.record.name}),
            url: this.config.url,
            params: {
                action: 'mgr/element_option_sets/remove',
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

    newElementRTEConfig: function(btn, e) {
        fred.loadPage('element_option_set/create');
    },

    quickUpdateElementRTEConfig: function (btn, e) {
        var updateElementOptionSet = MODx.load({
            xtype: 'fred-window-element-option-set',
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

        updateElementOptionSet.fp.getForm().reset();
        updateElementOptionSet.fp.getForm().setValues(this.menu.record);
        updateElementOptionSet.show(e.target);

        return true;
    },

    updateElementRTEConfig: function (btn, e) {
        fred.loadPage('element_option_set/update', {id: this.menu.record.id});
    }
});
Ext.reg('fred-grid-element-option-sets', fred.grid.ElementOptionSets);
