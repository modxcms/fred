fred.button.Help = function (config) {
    config = config || {};
    config.path = config.path || '';
    
    var cfg = {
        text: _('fred.global.help'),
        handler: fred.getHelp(config.path),
    };
    
    fred.button.Help.superclass.constructor.call(this, cfg);

};
Ext.extend(fred.button.Help, Ext.Button);
Ext.reg('fred-button-help', fred.button.Help);

fred.grid.GearGrid = function(config) {
    config = config || {};

    if (config.columns && Array.isArray(config.columns)) {
        config.columns.push({
            width: 40,
            fixed: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return '<i class="icon icon-gear" style="cursor: pointer" data-action="context"></i>';
            }
        });
    }

    fred.grid.GearGrid.superclass.constructor.call(this, config);

    this.on('click', function(e) {
        var target = e.getTarget();

        if (target && target.dataset.action) {
            if (target.dataset.action === 'context') {
                var record = this.getSelectionModel().getSelected();
                var ri = this.store.indexOf(record);
                this._showMenu(this, ri, e);
            }
        }
    }, this);
};
Ext.extend(fred.grid.GearGrid, MODx.grid.Grid);

fred.grid.LocalGearGrid = function(config) {
    config = config || {};

    if (config.columns && Array.isArray(config.columns)) {
        config.columns.push({
            width: 40,
            fixed: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return '<i class="icon icon-gear" style="cursor: pointer" data-action="context"></i>';
            }
        });
    }

    fred.grid.LocalGearGrid.superclass.constructor.call(this, config);

    this.on('click', function(e) {
        var target = e.getTarget();

        if (target && target.dataset.action) {
            if (target.dataset.action === 'context') {
                var record = this.getSelectionModel().getSelected();
                var ri = this.store.indexOf(record);
                this._showMenu(this, ri, e);
            }
        }
    }, this);
};
Ext.extend(fred.grid.LocalGearGrid, MODx.grid.LocalGrid);