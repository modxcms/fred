fred.window.ThemedTemplate = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.themed_templates.create'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'mgr/themed_templates/create',
        modal: true,
        autoHeight: true,
        buttonAlign: 'left',
        buttons: [
            {
                xtype: 'fred-button-help',
                path: 'cmp/themed_templates/'
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
    fred.window.ThemedTemplate.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.ThemedTemplate, MODx.Window, {
    getFields: function (config) {
        var fields = [];

        if (config.isUpdate) {
            fields.push({
                xtype: 'hidden',
                name: 'template'
            });
        }

        fields.push([
            {
                xtype: config.isUpdate ? 'modx-combo-template' : 'fred-combo-template',
                fieldLabel: _('fred.themed_templates.template'),
                name: config.isUpdate ? 'template_value' : 'templates',
                hiddenName: config.isUpdate ? 'template_value' : 'templates[]',
                anchor: '100%',
                allowBlank: false,
                disabled: config.isUpdate
            },
            {
                xtype: 'fred-combo-themes',
                fieldLabel: _('fred.themed_templates.theme'),
                name: 'theme',
                anchor: '100%',
                allowBlank: true,
                isUpdate: config.isUpdate,
                listeners: {
                    select: function(combo, record) {
                        var defaultBlueprint = this.find('name', 'default_blueprint');
                        if (!defaultBlueprint[0]) return;

                        defaultBlueprint = defaultBlueprint[0];
                        defaultBlueprint.setValue();
                        defaultBlueprint.enable();
                        defaultBlueprint.baseParams.theme = record.id;

                        defaultBlueprint.store.on('load', function() {
                            defaultBlueprint.setValue(0);
                        }, this, {single: true});

                        defaultBlueprint.store.load();
                    },
                    scope: this
                }
            },
            {
                xtype: 'fred-combo-blueprint',
                addNone: 1,
                complete: 1,
                public: 1,
                theme: (config.record && config.record.theme) ? config.record.theme : '',
                fieldLabel: _('fred.themed_templates.default_blueprint'),
                name: 'default_blueprint',
                hiddenName: 'default_blueprint',
                anchor: '100%',
                allowBlank: true,
                value: 0
            }
        ]);

        return fields;
    }
});
Ext.reg('fred-window-themed-template', fred.window.ThemedTemplate);
