fred.grid.ThemeBuildResolvers = function (config) {
    config = config || {};

    Ext.applyIf(config, {
        remoteSort: false,
        fields: ['file'],
        height: 250,
        columns: [
            {
                header: _('fred.themes.resolver'),
                dataIndex: 'file'
            }
        ],
        listeners: {
            beforerender: this.fillGrid
        },
        tbar: [
            {
                text: _('fred.themes.add_resolver'),
                handler: this.addResolver
            }
        ]
    });
    fred.grid.ThemeBuildResolvers.superclass.constructor.call(this, config);

};
Ext.extend(fred.grid.ThemeBuildResolvers, MODx.grid.LocalGrid, {
    _loadStore: function (config) {
        return new Ext.data.JsonStore({
            fields: config.fields,
            remoteSort: false,
            idProperty: 'file'
        });
    },

    getMenu: function() {
        return [
            {
                text: _('fred.themes.remove_resolver'),
                handler: this.removeResolver
            }
        ];
    },

    fillGrid: function (prepare) {
        if (this.config && this.config.initValue && Array.isArray(this.config.initValue)) {
            prepare.store.loadData(this.config.initValue);
        }
    },

    addResolver: function(btn, e) {
        var self = this;

        var addMediaSource = MODx.load({
            xtype: 'fred-window-theme-build-resolver',
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    },
                    scope: this
                },
                beforeSubmit: {
                    fn: function(values) {
                        if (self.store.find('file', values.file) !== -1) {
                            MODx.msg.alert(_('fred.themes.resolver_already_added'), _('fred.themes.resolver_already_added_desc'));
                            return false;
                        }

                        var field = this.find('name', 'file');
                        if (field[0] === undefined) return false;

                        field = field[0];

                        self.store.add(new self.store.recordType({file: field.getValue()}));

                        this.close();
                        return false;
                    }
                }
            }
        });

        addMediaSource.show(e.target);
    },

    removeResolver: function() {
        this.store.removeAt(this.menu.recordIndex);
    }
});
Ext.reg('fred-grid-theme-build-resolvers', fred.grid.ThemeBuildResolvers);
