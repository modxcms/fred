fred.grid.ThemedTemplates = function (config) {
    config = config || {};
    config.permission = config.permission || {};
    
    if (!config.permission.fred_themed_templates_save && !config.permission.fred_themed_templates_delete) {
        config.showGear = false;
    }
    
    Ext.applyIf(config, {
        url: fred.config.connectorUrl,
        baseParams: {
            action: 'mgr/themed_templates/getlist'
        },
        preventSaveRefresh: false,
        fields: ['id', 'theme', 'template', 'theme_name', 'template_templatename'],
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
                header: _('fred.themed_templates.template'),
                dataIndex: 'template_templatename',
                sortable: true,
                width: 80
            },
            {
                header: _('fred.themed_templates.theme'),
                dataIndex: 'theme_name',
                sortable: true,
                width: 80
            }
        ],
        tbar: this.getTbar(config)
    });
    fred.grid.ThemedTemplates.superclass.constructor.call(this, config);
};
Ext.extend(fred.grid.ThemedTemplates, fred.grid.GearGrid, {
    getMenu: function () {
        var m = [];

        if (this.config.permission.fred_themed_templates_save) {
            m.push({
                text: _('fred.themed_templates.update'),
                handler: this.updateTheme
            });
        }
        
        if (this.config.permission.fred_themed_templates_delete) {
            if (m.length > 0) {
                m.push('-');
            }
            
            m.push({
                text: _('fred.themed_templates.remove'),
                handler: this.unassignTheme
            });
        }
        
        return m;
    },
    
    getTbar: function(config) {
        var output = [];
        
        if (config.permission.fred_themed_templates_save) {
            output.push({
                text: _('fred.themed_templates.create'),
                handler: this.assignTheme
            });
        }
        
        return output;
    },

    assignTheme: function (btn, e) {
        var assignTheme = MODx.load({
            xtype: 'fred-window-themed-template',
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    },
                    scope: this
                }
            }
        });

        assignTheme.show(e.target);

        return true;
    },

    updateTheme: function (btn, e) {
        this.menu.record.template_value = this.menu.record.template;
        
        var updateTheme = MODx.load({
            xtype: 'fred-window-themed-template',
            title: _('fred.themed_templates.update'),
            action: 'mgr/themed_templates/update',
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

        // updateTheme.fp.getForm().reset();
        updateTheme.fp.getForm().setValues(this.menu.record);
        updateTheme.show(e.target);

        return true;
    },

    unassignTheme: function (btn, e) {
        if (!this.menu.record) return false;

        MODx.msg.confirm({
            title: _('fred.themed_templates.remove'),
            text: _('fred.themed_templates.remove_confirm', {template: this.menu.record.template_templatename, theme: this.menu.record.theme_name}),
            url: this.config.url,
            params: {
                action: 'mgr/themed_templates/remove',
                template: this.menu.record.template
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
Ext.reg('fred-grid-themed-templates', fred.grid.ThemedTemplates);