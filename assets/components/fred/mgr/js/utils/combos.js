fred.combo.ExtendedBoolean = function (config) {
    config.useInt = config.useInt || false;

    var data = [
        [
            _('fred.global.any'), 
            null, 
            _('fred.global.any')
        ],
        [
            _('yes'), 
            (config.useInt ? 1 : true), 
            _('yes')
        ],
        [
            _('no'), 
            (config.useInt ? 0 : false), 
            _('no')
        ]
    ];

    if (config.dataLabel) {
        data = [
            [
                config.dataLabel + ': ' + _('fred.global.any'), 
                null, 
                _('fred.global.any')
            ],
            [
                config.dataLabel + ': ' + _('yes'), 
                (config.useInt ? 1 : true), 
                _('yes')
            ],
            [
                config.dataLabel + ': ' + _('no'), 
                (config.useInt ? 0 : false), 
                _('no')
            ]
        ];
    }

    config = config || {};
    Ext.applyIf(config, {
        store: new Ext.data.SimpleStore({
            fields: ['d', 'v', 'cleanLabel'],
            data: data
        }),
        displayField: 'd',
        valueField: 'v',
        mode: 'local',
        triggerAction: 'all',
        editable: false,
        selectOnFocus: false,
        preventRender: true,
        forceSelection: true,
        enableKeyEvents: true,
        tpl: new Ext.XTemplate('<tpl for="."><div class="x-combo-list-item">{cleanLabel}</div></tpl>')
    });
    fred.combo.ExtendedBoolean.superclass.constructor.call(this, config);
};
Ext.extend(fred.combo.ExtendedBoolean, MODx.combo.ComboBox);
Ext.reg('fred-combo-extended-boolean', fred.combo.ExtendedBoolean);

fred.combo.Boolean = function (config) {
    config.useInt = config.useInt || false;

    var data = [
        [
            _('yes'),
            (config.useInt ? 1 : true),
            _('yes')
        ],
        [
            _('no'),
            (config.useInt ? 0 : false),
            _('no')
        ]
    ];

    if (config.dataLabel) {
        data = [
            [
                config.dataLabel + ': ' + _('yes'),
                (config.useInt ? 1 : true), _('yes')
            ],
            [
                config.dataLabel + ': ' + _('no'),
                (config.useInt ? 0 : false), _('no')
            ]
        ];
    }

    config = config || {};
    Ext.applyIf(config, {
        store: new Ext.data.SimpleStore({
            fields: ['d', 'v', 'cleanLabel'],
            data: data
        }),
        displayField: 'd',
        valueField: 'v',
        mode: 'local',
        triggerAction: 'all',
        editable: false,
        selectOnFocus: false,
        preventRender: true,
        forceSelection: true,
        enableKeyEvents: true,
        tpl: new Ext.XTemplate('<tpl for="."><div class="x-combo-list-item">{cleanLabel}</div></tpl>')
    });
    fred.combo.Boolean.superclass.constructor.call(this, config);
};
Ext.extend(fred.combo.Boolean, MODx.combo.ComboBox, {
    setValue: function (value) {
        if ((value !== undefined) && (this.config.useInt === true)) {
            if (value === '') {
                value = null;
            }

            if (value !== '') {
                value = +value;
            }
        }

        fred.combo.Boolean.superclass.setValue.call(this, value);
    }
});
Ext.reg('fred-combo-boolean', fred.combo.Boolean);

fred.combo.BlueprintCategories = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        name: 'category',
        hiddenName: 'category',
        displayField: 'name',
        valueField: 'id',
        fields: ['name', 'id'],
        pageSize: 20,
        url: fred.config.connectorUrl,
        baseParams: {
            action: 'mgr/blueprint_categories/getlist',
            addAll: config.addAll || 0
        }
    });
    fred.combo.BlueprintCategories.superclass.constructor.call(this, config);
};
Ext.extend(fred.combo.BlueprintCategories, MODx.combo.ComboBox);
Ext.reg('fred-combo-blueprint-categories', fred.combo.BlueprintCategories);