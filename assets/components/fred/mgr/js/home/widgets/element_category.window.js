fred.window.ElementCategory = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.element_categories.create'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'mgr/element_categories/create',
        modal: true,
        autoHeight: true,
        fields: this.getFields(config)
    });
    fred.window.ElementCategory.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.ElementCategory, MODx.Window, {
    getFields: function (config) {
        return [
            {
                xtype: 'textfield',
                name: 'id',
                anchor: '100%',
                hidden: true
            },
            {
                xtype: 'textfield',
                fieldLabel: _('fred.element_categories.name'),
                name: 'name',
                anchor: '100%',
                allowBlank: false
            },
            {
                xtype: 'fred-combo-themes',
                fieldLabel: _('fred.element_categories.theme'),
                name: 'theme',
                hiddenName: 'theme',
                anchor: '100%',
                disabled: config.isUpdate,
                allowBlank: false
            },
            {
                xtype: 'numberfield',
                allowDecimals: false,
                allowNegative: false,
                fieldLabel: _('fred.element_categories.rank'),
                name: 'rank',
                anchor: '100%',
                allowBlank: true
            }
        ];
    }
});
Ext.reg('fred-window-element-category', fred.window.ElementCategory);

fred.window.ElementCategoryDuplicate = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.element_categories.duplicate'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'mgr/element_categories/duplicate',
        modal: true,
        fields: this.getFields(config),
        autoHeight: true,
        keys: [
            {
                key: Ext.EventObject.ENTER,
                shift: true,
                fn: this.submit,
                scope: this
            }
        ]
    });
    fred.window.ElementCategoryDuplicate.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.ElementCategoryDuplicate, MODx.Window, {
    getFields: function (config) {
        return [
            {
                xtype: 'textfield',
                name: 'id',
                anchor: '100%',
                hidden: true
            },
            {
                xtype: 'textfield',
                fieldLabel: _('fred.element_categories.new_name'),
                name: 'name',
                anchor: '100%',
                allowBlank: true
            },
            {
                xtype: 'fred-combo-themes',
                fieldLabel: _('fred.element_categories.theme'),
                name: 'theme',
                hiddenName: 'theme',
                anchor: '100%',
                allowBlank: false
            }
        ]
    }
});
Ext.reg('fred-window-element-category-duplicate', fred.window.ElementCategoryDuplicate);
