fred.grid.ThemeBuildMediaSources = function (config) {
    config = config || {};

    Ext.applyIf(config, {
        remoteSort: false,
        fields: ['id', 'name', 'description'],
        height: 250,
        columns: [
            {
                header: _('id'),
                dataIndex: 'id',
                width: 20,
                sortable: true
            },
            {
                header: _('fred.themes.media_source_name'),
                dataIndex: 'name',
                width: 80,
                sortable: true
            },
            {
                header: _('fred.themes.media_source_description'),
                dataIndex: 'description',
                width: 120,
                sortable: true
            }
        ],
        listeners: {
            beforerender: this.fillGrid
        },
        tbar: [
            {
                text: _('fred.themes.add_media_source'),
                handler: this.addMediaSource
            }
        ]
    });
    fred.grid.ThemeBuildMediaSources.superclass.constructor.call(this, config);

};
Ext.extend(fred.grid.ThemeBuildMediaSources, MODx.grid.LocalGrid, {
    _loadStore: function (config) {
        return new Ext.data.JsonStore({
            fields: config.fields,
            remoteSort: false,
            idProperty: 'id'
        });
    },

    getMenu: function() {
        return [
            {
                text: _('fred.themes.remove_media_source'),
                handler: this.removeMediaSource
            }
        ];
    },

    fillGrid: function (prepare) {
        if (this.config && this.config.initValue && Array.isArray(this.config.initValue)) {
            MODx.Ajax.request({
                url: fred.config.connectorUrl,
                params: {
                    action: 'Fred\\Processors\\MediaSources\\GetList',
                    'id[]': this.config.initValue
                },
                listeners: {
                    'success': {
                        fn: function (r) {
                           if (r.results && Array.isArray(r.results)) {
                               prepare.store.loadData(r.results);
                           }
                        },
                        scope: this
                    }
                }
            });
        }
    },

    addMediaSource: function(btn, e) {
        var self = this;

        var addMediaSource = MODx.load({
            xtype: 'fred-window-theme-build-media-source',
            listeners: {
                success: {
                    fn: function () {
                        this.refresh();
                    },
                    scope: this
                },
                beforeSubmit: {
                    fn: function(values) {
                        if (self.store.find('id', values.source) !== -1) {
                            MODx.msg.alert(_('fred.themes.media_source_already_added'), _('fred.themes.media_source_already_added_desc'));
                            return false;
                        }

                        var field = this.find('name', 'source');
                        if (field[0] === undefined) return false;

                        field = field[0];

                        var fieldData = field.store.getById(values.source).data;

                        self.store.add(new self.store.recordType(fieldData));

                        this.close();
                        return false;
                    }
                }
            }
        });

        addMediaSource.show(e.target);
    },

    removeMediaSource: function() {
        this.store.removeAt(this.menu.recordIndex);
    }
});
Ext.reg('fred-grid-theme-build-media-sources', fred.grid.ThemeBuildMediaSources);
