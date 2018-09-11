fred.window.Theme = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.themes.create'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'mgr/themes/create',
        modal: true,
        autoHeight: true,
        fields: this.getFields(config),
        keys: [
            {
                key: Ext.EventObject.ENTER,
                shift: true,
                fn: this.submit,
                scope: this
            }
        ]
    });
    fred.window.Theme.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.Theme, MODx.Window, {
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
                fieldLabel: _('fred.themes.name'),
                name: 'name',
                anchor: '100%',
                allowBlank: false
            },
            {
                xtype: 'textarea',
                fieldLabel: _('fred.themes.description'),
                name: 'description',
                anchor: '100%',
                allowBlank: true
            }
        ];
    }
});
Ext.reg('fred-window-theme', fred.window.Theme);

fred.window.ThemeDuplicate = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.themes.duplicate'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'mgr/themes/duplicate',
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
    fred.window.ThemeDuplicate.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.ThemeDuplicate, MODx.Window, {
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
                fieldLabel: _('fred.themes.new_name'),
                name: 'name',
                anchor: '100%',
                allowBlank: true
            }
        ]
    }
});
Ext.reg('fred-window-theme-duplicate', fred.window.ThemeDuplicate);

fred.window.ThemeBuild = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.themes.duplicate'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'mgr/themes/build',
        modal: true,
        fields: this.getFields(config),
        autoHeight: true,
        width: 800,
        keys: [
            {
                key: Ext.EventObject.ENTER,
                shift: true,
                fn: this.submit,
                scope: this
            }
        ],
        buttons: [
            {
                text: config.cancelBtnText || _('cancel'),
                scope: this,
                handler: function () {
                    config.closeAction !== 'close' ? this.hide() : this.close();
                }
            },
            {
                text: _('fred.themes.build'),
                scope: this,
                handler: this.submit
            },
            {
                text: 'Build & Download Theme',
                cls: 'primary-button',
                scope: this,
                handler: function(){
                    this.on('success', function() {
                        fred.loadPage('theme/download', {theme: this.record.id});
                    }, this, {single: true});
                    this.submit();
                }
            }
        ]
    });
    fred.window.ThemeBuild.superclass.constructor.call(this, config);

    this.on('beforeSubmit', function () {
        var dependencies = this.find('name', 'dependencies')[0];
        dependencies.setValue(Ext.getCmp('fred-window-theme-build-dependencies').encode());

        var folders = this.find('name', 'folders')[0];
        folders.setValue(Ext.getCmp('fred-window-theme-build-folders').encode());
    }, this);
};
Ext.extend(fred.window.ThemeBuild, MODx.Window, {
    getFields: function (config) {
        return [
            {
                xtype: 'hidden',
                name: 'id'
            },
            {
                layout: 'column',
                border: false,
                anchor: '100%',
                defaults: {
                    layout: 'form',
                    labelAlign: 'top',
                    labelSeparator: '',
                    anchor: '100%',
                    border: false
                },
                items: [
                    {
                        columnWidth: .4,
                        border: false,
                        defaults: {
                            msgTarget: 'under',
                            anchor: '100%'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: _('fred.themes.name'),
                                name: 'name',
                                anchor: '100%',
                                validator: function(value) {
                                    if (value.indexOf('-') !== -1) {
                                        return _('fred.err.theme_name_invalid_char');
                                    }
                                    
                                    return true;
                                },
                                allowBlank: false
                            }
                        ]
                    },
                    {
                        columnWidth: .3,
                        border: false,
                        defaults: {
                            msgTarget: 'under',
                            anchor: '100%'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: _('fred.themes.version'),
                                name: 'version',
                                anchor: '100%',
                                allowBlank: false
                            }
                        ]
                    },
                    {
                        columnWidth: .3,
                        border: false,
                        defaults: {
                            msgTarget: 'under',
                            anchor: '100%'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: _('fred.themes.release'),
                                name: 'release',
                                anchor: '100%',
                                allowBlank: false
                            }
                        ]
                    },
                ]
            },
            {
                xtype: 'fred-combo-root-category',
                fieldLabel: _('fred.themes.categories'),
                name: 'categories',
                hiddenName: 'categories[]',
                anchor: '100%'

            },
            {
                xtype: 'modx-tabs',
                deferredRender: false,
                defaults: {
                    border: false,
                    autoHeight: true,
                    layout: 'form'
                },
                border: false,
                hideMode: 'offsets',
                items: [
                    {
                        title: _('fred.themes.docs'),
                        items: [
                            {
                                xtype: Ext.ComponentMgr.isRegistered('modx-texteditor') ? 'modx-texteditor' : 'textarea',
                                fieldLabel: _('fred.themes.changelog'),
                                name: 'docs_changelog',
                                anchor: '100%',
                                grow: true,
                                growMax: 250,
                                growMin: 100
                            },
                            {
                                xtype: 'modx-combo-browser',
                                fieldLabel: _('fred.themes.readme'),
                                name: 'docs_readme',
                                anchor: '100%',
                                allowBlank: false,
                                listeners: {
                                    select: function (data) {
                                        this.setValue(data.fullRelativeUrl);
                                    }
                                }
                            },
                            {
                                xtype: 'modx-combo-browser',
                                fieldLabel: _('fred.themes.license'),
                                name: 'docs_license',
                                anchor: '100%',
                                allowBlank: false,
                                listeners: {
                                    select: function (data) {
                                        this.setValue(data.fullRelativeUrl);
                                    }
                                }
                            }
                        ]
                    },
                    {
                        title: _('fred.themes.folders'),
                        items: [
                            {
                                xtype: 'hidden',
                                name: 'folders'
                            },
                            {
                                id: 'fred-window-theme-build-folders',
                                xtype: 'fred-grid-folders',
                                initValue: (config.record && config.record.folders) ? config.record.folders : [],
                                maxHeight: 300
                            }
                        ]
                    },
                    {
                        title: _('fred.themes.dependencies'),
                        items: [
                            {
                                xtype: 'hidden',
                                name: 'dependencies'
                            },
                            {
                                id: 'fred-window-theme-build-dependencies',
                                xtype: 'fred-grid-dependencies',
                                initValue: (config.record && config.record.dependencies) ? config.record.dependencies : [],
                                maxHeight: 300
                            }
                        ]
                    }
                ]
            }
        ]
    }
});
Ext.reg('fred-window-theme-build', fred.window.ThemeBuild);
