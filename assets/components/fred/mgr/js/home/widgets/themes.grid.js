fred.grid.Themes = function (config) {
    config = config || {};
    config.permission = config.permission || {};

    if (config.permission.fred_themes_save) {
        config.save_action = 'Fred\\Processors\\Themes\\UpdateFromGrid';
        config.autosave = true;
    }

    if (!config.permission.fred_themes_save && !config.permission.fred_themes_build && !config.permission.fred_themes_delete) {
        config.showGear = false;
    }

    Ext.applyIf(config, {
        url: MODx.config.connector_url,
        baseParams: {
            action: 'Fred\\Processors\\Themes\\GetList'
        },
        preventSaveRefresh: false,
        fields: ['id', 'name', 'description', 'config', 'latest_build', 'theme_folder', 'default_element', 'namespace', 'settingsPrefix'],
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
                editor: this.getEditor(config, {xtype: 'textfield'})
            },
            {
                header: _('fred.themes.description'),
                dataIndex: 'description',
                sortable: true,
                width: 80,
                editor: this.getEditor(config, {xtype: 'textfield'})
            },
            {
                header: _('fred.themes.theme_folder'),
                dataIndex: 'theme_folder',
                sortable: true,
                width: 80,
                editor: this.getEditor(config, {xtype: 'textfield'})
            },
            {
                header: _('fred.themes.namespace'),
                dataIndex: 'namespace',
                width: 80
            },
            {
                header: _('fred.themes.settings_prefix'),
                dataIndex: 'settingsPrefix',
                width: 80
            },
            {
                header: _('fred.themes.default_element'),
                dataIndex: 'default_element',
                sortable: true,
                width: 80,
                editor: this.getEditor(config, {xtype: 'textfield'})
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
        tbar: this.getTbar(config)
    });
    fred.grid.Themes.superclass.constructor.call(this, config);
};
Ext.extend(fred.grid.Themes, MODx.grid.Grid, {
    getMenu: function () {
        var m = [];

        if (this.config.permission.fred_themes_build) {
            m.push({
                text: _('fred.themes.build'),
                handler: this.buildTheme
            });
        }

        if (this.config.permission.fred_themes_save) {
            if (m.length > 0) {
                m.push('-');
            }

            m.push({
                text: _('fred.themes.update'),
                handler: this.updateTheme
            });

            m.push('-');

            m.push({
                text: _('fred.themes.duplicate'),
                handler: this.duplicateTheme
            });
        }

        if (this.config.permission.fred_themes_delete) {
            if (m.length > 0) {
                m.push('-');
            }

            m.push({
                text: _('fred.themes.remove'),
                handler: this.removeTheme
            });
        }

        return m;
    },

    getTbar: function(config) {
        var output = [];

        if (config.permission.fred_themes_save) {
            output.push({
                text: _('fred.themes.create'),
                handler: this.createTheme
            });
        }

        output.push([
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
        ]);

        return output;
    },

    createTheme: function (btn, e) {
        var createTheme = MODx.load({
            xtype: 'fred-window-theme',
            listeners: {
                success: {
                    fn: function (r,b,x) {
                        this.refresh();
                        if (r && r.a && r.a.result && r.a.result.object && r.a.result.object.theme_folder !== '') {
                            MODx.msg.alert(_('fred.themes.theme_dir_msg_title'), _('fred.themes.theme_dir_msg', {theme_folder: r.a.result.object.theme_folder}));
                        }
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
            action: 'Fred\\Processors\\Themes\\Update',
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
        if ((this.menu.record.name.toLowerCase() === 'default') || (this.menu.record.theme_folder.toLowerCase() === 'default')) {
            MODx.msg.alert(_('fred.themes.build_default_title'), _('fred.themes.build_default_desc'));
            return;
        }

        if (!this.menu.record.config || (typeof this.menu.record.config !== 'object')) this.menu.record.config = {};

        this.menu.record.config.id = this.menu.record.id;
        this.menu.record.config.theme_folder = this.menu.record.theme_folder;
        this.menu.record.config.name = this.menu.record.config.name || this.menu.record.name.toLowerCase().replace(/ /g, '');
        this.menu.record.config.release = this.menu.record.config.release || 'pl';
        this.menu.record.config.version = this.menu.record.config.version || '1.0.0';
        this.menu.record.config['categories[]'] = (this.menu.record.config.categories && Array.isArray(this.menu.record.config.categories)) ? this.menu.record.config.categories.join() : '';

        var buildTheme = MODx.load({
            xtype: 'fred-window-theme-build',
            title: _('fred.themes.build'),
            action: 'Fred\\Processors\\Themes\\Build',
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
        var record = {
            id: this.menu.record.id,
            name: _('fred.themes.theme_duplicate_name', {theme: this.menu.record.name})
        };
        var duplicateTheme = MODx.load({
            xtype: 'fred-window-theme-duplicate',
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

        duplicateTheme.fp.getForm().reset();
        duplicateTheme.fp.getForm().setValues(record);
        duplicateTheme.show(e.target);

        return true;
    },

    removeTheme: function (btn, e) {
        if (!this.menu.record) return false;

        var removeTheme = MODx.load({
            xtype: 'fred-window-remove-theme',
            record: this.menu.record,
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                        fred.globalEvents.fireEvent('delete-theme', this.menu.record)
                    },
                    scope: this
                }
            }
        });

        removeTheme.fp.getForm().reset();
        removeTheme.fp.getForm().setValues(this.menu.record);
        removeTheme.show(e.target);

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
    },

    getEditor: function(config, editor) {
        if (config.permission.fred_themes_save) return editor;

        return false;
    }
});
Ext.reg('fred-grid-themes', fred.grid.Themes);
