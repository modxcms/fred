fred.grid.Folders = function (config) {
    config = config || {};

    Ext.applyIf(config, {
        remoteSort: false,
        fields: ['source', 'target'],
        autoHeight: true,
        maxHeight: 300,
        columns: [
            {
                header: _('fred.themes.source_folder'),
                dataIndex: 'source',
                width: 120,
                sortable: true,
                editor: {xtype: 'textfield'}
            },
            {
                header: _('fred.themes.target_folder'),
                dataIndex: 'target',
                width: 120,
                sortable: true,
                editor: {xtype: 'textfield'}
            }
        ],
        listeners: {
            beforerender: this.fillGrid,
            validateedit: function(data) {
                var valid = true;

                this.store.each(function (record, index) {
                    if ((index !== data.row) && record.data.source.toLowerCase() === data.value.toLowerCase()) {
                        valid = false;
                        return false;
                    }
                });
                
                if (!valid) {
                    MODx.msg.alert('Error', 'Source Folder must be unique');
                    return false;
                }
                
                return valid;
            }
        },
        tbar: [
            {
                text: _('fred.themes.add_folder'),
                handler: this.addFolder
            }
        ]
    });
    fred.grid.Folders.superclass.constructor.call(this, config);

};
Ext.extend(fred.grid.Folders, MODx.grid.LocalGrid, {
    _loadStore: function (config) {
        return new Ext.data.JsonStore({
            fields: config.fields,
            remoteSort: false,
            idProperty: 'source'
        });
    },

    getMenu: function() {
        return [
            {
                text: _('fred.themes.remove_folder'),
                handler: this.removeFolder
            }
        ];
    },

    fillGrid: function (prepare) {
        if (this.config && this.config.initValue && Array.isArray(this.config.initValue)) {
            prepare.store.loadData(this.config.initValue);
        }
    },

    addFolder: function(btn, e) {
        this.stopEditing();
        this.store.add(new this.store.recordType({source: '', target: ''}));
        this.startEditing(this.store.getCount() - 1, 0);
    },

    removeFolder: function() {
        this.store.removeAt(this.menu.recordIndex);
    }
});
Ext.reg('fred-grid-folders', fred.grid.Folders);
