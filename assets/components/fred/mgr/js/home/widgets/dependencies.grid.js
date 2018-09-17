fred.grid.Dependencies = function (config) {
    config = config || {};

    Ext.applyIf(config, {
        remoteSort: false,
        fields: ['name', 'version'],
        height: 250,
        columns: [
            {
                header: _('fred.themes.package_name'),
                dataIndex: 'name',
                width: 120,
                sortable: true,
                editor: {xtype: 'fred-combo-installed-packages'}
            },
            {
                header: _('fred.themes.version'),
                dataIndex: 'version',
                width: 120,
                sortable: true,
                editor: {xtype: 'textfield'}
            }
        ],
        listeners: {
            beforerender: this.fillGrid,
            beforeedit: function(data) {
                if ((data.field === 'name') && (data.value === 'fred')) {
                    return false;
                }
                
                return true;
            },
            validateedit: function(data) {
                var valid = true;

                this.store.each(function (record, index) {
                    if ((index !== data.row) && record.data.name.toLowerCase() === data.value.toLowerCase()) {
                        valid = false;
                        return false;
                    }
                });
                
                if (!valid) {
                    MODx.msg.alert('Error', 'Package Name must be unique');
                    return false;
                }
                
                return valid;
            }
        },
        tbar: [
            {
                text: _('fred.themes.add_dependency'),
                handler: this.addDependency
            }
        ]
    });
    fred.grid.Dependencies.superclass.constructor.call(this, config);

};
Ext.extend(fred.grid.Dependencies, MODx.grid.LocalGrid, {
    _loadStore: function (config) {
        return new Ext.data.JsonStore({
            fields: config.fields,
            remoteSort: false,
            idProperty: 'name'
        });
    },

    getMenu: function() {
        return [
            {
                text: _('fred.themes.remove_dependency'),
                handler: this.removeDependency
            }
        ];
    },

    fillGrid: function (prepare) {
        if (this.config && this.config.initValue && Array.isArray(this.config.initValue)) {
            prepare.store.loadData(this.config.initValue);
        } else {
            prepare.store.loadData([{name: "fred", version: '*'}]);
        }
    },

    addDependency: function(btn, e) {
        this.stopEditing();
        this.store.add(new this.store.recordType({name: '', version: '*'}));
        this.startEditing(this.store.getCount() - 1, 0);
    },

    removeDependency: function() {
        if (this.menu.record.name === 'fred') {
            MODx.msg.alert(_('fred.err.fred_dependency_title'), _('fred.err.fred_dependency_body'));
            return;
        }
        
        this.store.removeAt(this.menu.recordIndex);
    }
});
Ext.reg('fred-grid-dependencies', fred.grid.Dependencies);
