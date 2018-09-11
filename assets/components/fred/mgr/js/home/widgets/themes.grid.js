fred.grid.Themes = function (config) {
    config = config || {};

    Ext.applyIf(config, {
        url: fred.config.connectorUrl,
        baseParams: {
            action: 'mgr/themes/getlist'
        },
        save_action: 'mgr/themes/updatefromgrid',
        autosave: true,
        preventSaveRefresh: false,
        fields: ['id', 'name', 'description', 'config', 'latest_build'],
        paging: true,
        remoteSort: true,
        emptyText: _('fred.themes.none'),
        columns: [
            {
                header: _('id'),
                dataIndex: 'id',
                sortable: true,
                hidden: true
            },
            {
                header: _('fred.themes.name'),
                dataIndex: 'name',
                sortable: true,
                width: 80,
                editor: {xtype: 'textfield'}
            },
            {
                header: _('fred.themes.description'),
                dataIndex: 'description',
                sortable: true,
                width: 80,
                editor: {xtype: 'textfield'}
            },
            {
                header: _('fred.themes.latest_build'),
                dataIndex: 'latest_build',
                sortable: false,
                width: 80,
                renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                    if (value === false) return '';
                    
                    return '<a href="' + fred.getPageUrl('theme/download', {theme: record.id}) +'">' + value + '</a>';
                }
            }
        ],
        tbar: [
            {
                text: _('fred.themes.create'),
                handler: this.assignTheme
            },
            '->',
            {
                xtype: 'textfield',
                emptyText: _('fred.themes.search_name'),
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
            }
        ]
    });
    fred.grid.Themes.superclass.constructor.call(this, config);
};
Ext.extend(fred.grid.Themes, MODx.grid.Grid, {
    getMenu: function () {
        var m = [];

        m.push({
            text: _('fred.themes.build'),
            handler: this.buildTheme
        });

        m.push('-');
        
        m.push({
            text: _('fred.themes.update'),
            handler: this.updateTheme
        });

        m.push('-');

        m.push({
            text: _('fred.themes.duplicate'),
            handler: this.duplicateTheme
        });
        
        m.push('-');

        m.push({
            text: _('fred.themes.remove'),
            handler: this.unassignTheme
        });
        return m;
    },

    assignTheme: function (btn, e) {
        var createTheme = MODx.load({
            xtype: 'fred-window-theme',
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    },
                    scope: this
                }
            }
        });

        createTheme.show(e.target);

        return true;
    },

    updateTheme: function (btn, e) {
        var updateTheme = MODx.load({
            xtype: 'fred-window-theme',
            title: _('fred.themes.update'),
            action: 'mgr/themes/update',
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

        updateTheme.fp.getForm().reset();
        updateTheme.fp.getForm().setValues(this.menu.record);
        updateTheme.show(e.target);

        return true;
    },
    
    buildTheme: function (btn, e) {
        if (!this.menu.record.config || (typeof this.menu.record.config !== 'object')) this.menu.record.config = {};
        
        this.menu.record.config.id = this.menu.record.id;
        this.menu.record.config.name = this.menu.record.config.name || this.menu.record.name.toLowerCase().replace(/ /g, '');
        this.menu.record.config.release = this.menu.record.config.release || 'pl';
        this.menu.record.config.version = this.menu.record.config.version || '1.0.0';
        this.menu.record.config['categories[]'] = (this.menu.record.config.categories && Array.isArray(this.menu.record.config.categories)) ? this.menu.record.config.categories.join() : '';
        
        var buildTheme = MODx.load({
            xtype: 'fred-window-theme-build',
            title: _('fred.themes.build'),
            action: 'mgr/themes/build',
            isUpdate: true,
            record: this.menu.record.config,
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    },
                    scope: this
                }
            }
        });

        buildTheme.fp.getForm().setValues(this.menu.record.config);
        buildTheme.show(e.target);

        return true;
    },

    duplicateTheme: function (btn, e) {
        var duplicateTheme = MODx.load({
            xtype: 'fred-window-theme-duplicate',
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

        duplicateTheme.fp.getForm().reset();
        duplicateTheme.fp.getForm().setValues(this.menu.record);
        duplicateTheme.show(e.target);

        return true;
    },

    unassignTheme: function (btn, e) {
        if (!this.menu.record) return false;

        MODx.msg.confirm({
            title: _('fred.themes.remove'),
            text: _('fred.themes.remove_confirm', {name: this.menu.record.name}),
            url: this.config.url,
            params: {
                action: 'mgr/themes/remove',
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
        s.baseParams[combo.filterName] = record.data.v;
        this.getBottomToolbar().changePage(1);
    }
});
Ext.reg('fred-grid-themes', fred.grid.Themes);