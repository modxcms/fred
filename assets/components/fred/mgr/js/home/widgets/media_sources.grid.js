fred.grid.MediaSources = function (config) {
    config = config || {};

    Ext.applyIf(config, {
        url: MODx.config.connector_url,
        baseParams: {
            action: 'Fred\\Processors\\MediaSources\\GetList'
        },
        save_action: 'Fred\\Processors\\MediaSources\\UpdateFromGrid',
        autosave: true,
        preventSaveRefresh: false,
        fields: ['id', 'name', 'description', 'fred', 'fredReadOnly'],
        paging: true,
        remoteSort: true,
        emptyText: _('fred.media_sources.none'),
        columns: [
            {
                header: _('id'),
                dataIndex: 'id',
                sortable: true,
                hidden: true
            },
            {
                header: _('fred.media_sources.name'),
                dataIndex: 'name',
                sortable: true,
                width: 80
            },
            {
                header: _('fred.media_sources.description'),
                dataIndex: 'description',
                sortable: true,
                width: 80
            },
            {
                header: _('fred.media_sources.fred'),
                dataIndex: 'fred',
                sortable: true,
                width: 80,
                editor: {xtype: 'modx-combo-boolean'},
                renderer: this.rendYesNo
            },
            {
                header: _('fred.media_sources.fred_read_only'),
                dataIndex: 'fredReadOnly',
                sortable: true,
                width: 80,
                editor: {xtype: 'modx-combo-boolean'},
                renderer: this.rendYesNo
            }
        ],
        tbar: [
            {
                text: _('fred.media_sources.go_to'),
                handler: this.goToMediaSources
            },
            '->',
            {
                xtype: 'textfield',
                emptyText: _('fred.media_sources.search'),
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
    fred.grid.MediaSources.superclass.constructor.call(this, config);
};
Ext.extend(fred.grid.MediaSources, MODx.grid.Grid, {
    getMenu: function () {
        var m = [];

        m.push({
            text: _('fred.media_sources.update'),
            handler: this.updateMediaSource
        });

        return m;
    },

    goToMediaSources: function (btn, e) {
        MODx.loadPage('source');
    },

    updateMediaSource: function() {
        MODx.loadPage('source/update', 'id='+this.menu.record.id);
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
Ext.reg('fred-grid-media-sources', fred.grid.MediaSources);
