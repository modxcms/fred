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
        buttonAlign: 'left',
        buttons: [
            {
                xtype: 'fred-button-help',
                path: 'cmp/element_categories/'
            },
            '->',
            {
                text: config.cancelBtnText || _('cancel'),
                scope: this,
                handler: function() { config.closeAction !== 'close' ? this.hide() : this.close(); }
            },
            {
                text: config.saveBtnText || _('save'),
                cls: 'primary-button',
                scope: this,
                handler: this.submit
            }
        ],
        fields: this.getFields(config)
    });
    fred.window.ElementCategory.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.ElementCategory, MODx.Window, {
    getFields: function (config) {
        var fields = [{
            xtype: 'hidden',
            name: 'id'
        }];
        
        if (config.isUpdate) {
            fields.push([{
                xtype: 'hidden',
                name: 'theme'
            }]);
        }
        
        fields.push([
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
                name: config.isUpdate ? 'theme_id' : 'theme',
                hiddenName: config.isUpdate ? 'theme_id' : 'theme',
                anchor: '100%',
                disabled: config.isUpdate,
                allowBlank: config.isUpdate,
                isUpdate: config.isUpdate
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
        ]);
        
        return fields;
    }
});
Ext.reg('fred-window-element-category', fred.window.ElementCategory);

fred.window.ElementCategoryDuplicate = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.element_categories.duplicate'),
        closeAction: 'close',
        isUpdate: true,
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
                allowBlank: false,
                isUpdate: config.isUpdate
            }
        ]
    }
});
Ext.reg('fred-window-element-category-duplicate', fred.window.ElementCategoryDuplicate);
