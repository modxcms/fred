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

fred.combo.ElementCategories = function (config) {
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
            action: 'mgr/element_categories/getlist',
            addAll: config.addAll || 0
        }
    });
    fred.combo.ElementCategories.superclass.constructor.call(this, config);
};
Ext.extend(fred.combo.ElementCategories, MODx.combo.ComboBox);
Ext.reg('fred-combo-element-categories', fred.combo.ElementCategories);

fred.combo.ElementOptionSets = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        name: 'option_set',
        hiddenName: 'option_set',
        displayField: 'name',
        valueField: 'id',
        fields: ['name', 'id', 'description'],
        tpl: new Ext.XTemplate('<tpl for="."><div class="x-combo-list-item"><span style="font-weight: bold">{name:htmlEncode}</span>',
            '<tpl if="description"> - <span style="font-style:italic">{description:htmlEncode}</span></tpl>',
            '</div></tpl>'),
        pageSize: 20,
        url: fred.config.connectorUrl,
        baseParams: {
            action: 'mgr/element_option_sets/getlist',
            addEmpty: config.addEmpty || 0
        }
    });
    fred.combo.ElementOptionSets.superclass.constructor.call(this, config);
};
Ext.extend(fred.combo.ElementOptionSets, MODx.combo.ComboBox, {

});
Ext.reg('fred-combo-element-option-sets', fred.combo.ElementOptionSets);

fred.combo.Themes = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        name: 'theme',
        hiddenName: 'theme',
        displayField: 'name',
        valueField: 'id',
        fields: ['name', 'id', 'theme_folder'],
        pageSize: 20,
        isUpdate: false,
        url: fred.config.connectorUrl,
        baseParams: {
            action: 'mgr/themes/getlist',
            addAll: config.addAll || 0
        }
    });
    fred.combo.Themes.superclass.constructor.call(this, config);

    if (config.isUpdate === false) {
        this.store.load();
        this.store.on('load', function(store, r) {
            this.setValue(r[0].id);
            this.fireEvent('select', this, r[0]);
        }, this, {single: true});
    }
};
Ext.extend(fred.combo.Themes, MODx.combo.ComboBox);
Ext.reg('fred-combo-themes', fred.combo.Themes);

fred.combo.Template = function (config, getStore) {
    config = config || {};

    if (!config.clearBtnCls) {
        if (MODx.config.connector_url) {
            config.clearBtnCls = 'x-form-trigger';
        } else {
            config.clearBtnCls = null;
        }
    }

    if (!config.expandBtnCls) {
        if (MODx.config.connector_url) {
            config.expandBtnCls = 'x-form-trigger';
        } else {
            config.expandBtnCls = null;
        }
    }

    Ext.applyIf(config, {
        name: 'templates',
        hiddenName: 'templates[]',
        displayField: 'templatename',
        valueField: 'id',
        fields: ['templatename', 'id'],
        mode: 'remote',
        triggerAction: 'all',
        typeAhead: true,
        editable: true,
        forceSelection: false,
        pageSize: 20,
        url: fred.config.connectorUrl,
        baseParams: {
            action: 'mgr/extra/gettemplates',
            hideUsed: 1
        }
    });
    Ext.applyIf(config, {
        store: new Ext.data.JsonStore({
            url: config.url,
            root: 'results',
            totalProperty: 'total',
            fields: config.fields,
            errorReader: MODx.util.JSONReader,
            baseParams: config.baseParams || {},
            remoteSort: config.remoteSort || false,
            autoDestroy: true
        })
    });
    if (getStore === true) {
        config.store.load();
        return config.store;
    }
    fred.combo.Template.superclass.constructor.call(this, config);
    this.config = config;
    return this;
};
Ext.extend(fred.combo.Template, Ext.ux.form.SuperBoxSelect);
Ext.reg('fred-combo-template', fred.combo.Template);

fred.combo.RootCategory = function (config, getStore) {
    config = config || {};

    if (!config.clearBtnCls) {
        if (MODx.config.connector_url) {
            config.clearBtnCls = 'x-form-trigger';
        } else {
            config.clearBtnCls = null;
        }
    }

    if (!config.expandBtnCls) {
        if (MODx.config.connector_url) {
            config.expandBtnCls = 'x-form-trigger';
        } else {
            config.expandBtnCls = null;
        }
    }

    Ext.applyIf(config, {
        name: 'categories',
        hiddenName: 'categories[]',
        displayField: 'category',
        valueField: 'category',
        fields: ['category'],
        mode: 'remote',
        triggerAction: 'all',
        typeAhead: true,
        editable: true,
        forceSelection: false,
        pageSize: 20,
        url: fred.config.connectorUrl,
        baseParams: {
            action: 'mgr/extra/getcategories',
            parent: 0
        }
    });
    Ext.applyIf(config, {
        store: new Ext.data.JsonStore({
            url: config.url,
            root: 'results',
            totalProperty: 'total',
            fields: config.fields,
            errorReader: MODx.util.JSONReader,
            baseParams: config.baseParams || {},
            remoteSort: config.remoteSort || false,
            autoDestroy: true
        })
    });
    if (getStore === true) {
        config.store.load();
        return config.store;
    }
    fred.combo.RootCategory.superclass.constructor.call(this, config);
    this.config = config;
    return this;
};
Ext.extend(fred.combo.RootCategory, Ext.ux.form.SuperBoxSelect);
Ext.reg('fred-combo-root-category', fred.combo.RootCategory);

fred.combo.InstalledPackages = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        name: 'package',
        hiddenName: 'package',
        displayField: 'package_name',
        valueField: 'package_name',
        fields: ['package_name'],
        pageSize: 20,
        isUpdate: false,
        url: fred.config.connectorUrl,
        editable: true,
        forceSelection: false,
        typeAhead: false,
        selectOnFocus: false,
        baseParams: {
            action: 'mgr/extra/getinstalledpackages'
        }
    });
    fred.combo.Themes.superclass.constructor.call(this, config);

    if (config.isUpdate === false) {
        this.store.load();
        this.store.on('load', function(store, r) {
            this.setValue(r[0].id);
            this.fireEvent('select', this, r[0]);
        }, this, {single: true});
    }
};
Ext.extend(fred.combo.InstalledPackages, MODx.combo.ComboBox);
Ext.reg('fred-combo-installed-packages', fred.combo.InstalledPackages);

fred.combo.Blueprint = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        name: 'blueprint',
        hiddenName: 'blueprint',
        displayField: 'name',
        valueField: 'id',
        fields: ['name', 'id'],
        pageSize: 20,
        url: fred.config.connectorUrl,
        baseParams: {
            action: 'mgr/blueprints/getlist',
            addNone: config.addNone || 0,
            complete: (config.complete !== undefined) ? config.complete : '',
            public: (config.public !== undefined) ? config.public : '',
            theme: (config.theme !== undefined) ? config.theme : ''
        }
    });
    fred.combo.Blueprint.superclass.constructor.call(this, config);
};
Ext.extend(fred.combo.Blueprint, MODx.combo.ComboBox);
Ext.reg('fred-combo-blueprint', fred.combo.Blueprint);
