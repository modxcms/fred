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
                xtype: 'hidden',
                name: 'id'
            },
            {
                xtype: 'textfield',
                fieldLabel: _('fred.themes.new_name'),
                name: 'name',
                anchor: '100%',
                allowBlank: true
            },
            {
                xtype: 'xcheckbox',
                name: 'duplicate_theme_objects',
                boxLabel: _('fred.themes.duplicate_theme_objects'),
                hideLabel: true,
                labelSeparator: ''
            },
            {
                xtype: 'xcheckbox',
                name: 'duplicate_theme_folder',
                boxLabel: _('fred.themes.duplicate_theme_folder'),
                hideLabel: true,
                labelSeparator: ''
            },
            {
                xtype: 'xcheckbox',
                name: 'duplicate_templates',
                boxLabel: _('fred.themes.duplicate_templates'),
                hideLabel: true,
                labelSeparator: ''
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
        buttonAlign: 'left',
        buttons: [
            {
                xtype: 'fred-button-help',
                path: 'cmp/themes/#build'
            }, '->', {
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
                text: _('fred.themes.build_and_download'),
                cls: 'primary-button',
                scope: this,
                handler: function () {
                    this.on('success', function () {
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
        
        var mediaSources = this.find('name', 'mediaSources')[0];
        mediaSources.setValue(Ext.getCmp('fred-window-theme-build-media-sources').encode());
    }, this);
    
    this.on('failure', function(a) {
        try {
            var response = JSON.parse(a.a.response.responseText);
            var msg = [];
            
            if (response.data && Array.isArray(response.data)) {
                response.data.forEach(function(item) {
                    msg.push(item.msg);
                });
            }
            
            if (msg.length > 0) {
                msg = msg.join('<br>');
            } else {
                msg = _('error');
            }
            
            Ext.Msg.alert(_('error'), msg);
        } catch (err) {
            Ext.Msg.alert(_('error'), _('error'));
        }
    });
};
Ext.extend(fred.window.ThemeBuild, MODx.Window, {
    getFields: function (config) {
        return [
            {
                xtype: 'hidden',
                name: 'id'
            },
            {
                html: '<br/><p>' + _('fred.themes.theme_build_desc') + '</p>'
            },
            {
                xtype: 'modx-tabs',
                deferredRender: false,
                defaults: {
                    border: false,
                    autoHeight: true,
                    labelSeparator: '',
                    layout: 'form',
                    msgTarget: 'under'
                },
                border: false,
                hideMode: 'offsets',
                items: [
                    {
                        title: _('fred.themes.overview'),
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: _('fred.themes.name'),
                                name: 'name',
                                anchor: '100%',
                                regex: /^[a-z_]+$/,
                                regexText: _('fred.err.theme_name_invalid_format'),
                                allowBlank: false,
                                msgTarget: 'under'
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
                                        columnWidth: .5,
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
                                                allowBlank: false,
                                                regex: /^[0-9]+\.[0-9]+\.[0-9]+$/,
                                                regexText: _('fred.err.themes_version_number_format')
                                            }
                                        ]
                                    },
                                    {
                                        columnWidth: .5,
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
                                                allowBlank: false,
                                                regex: /^(pl|beta|alpha)[0-9]*$/,
                                                regexText: _('fred.err.themes_release_format')
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
                                xtype: 'statictextfield',
                                fieldLabel: _('fred.themes.included_theme_folder'),
                                anchor: '100%',
                                value: ('/assets/themes/' + config.record.theme_folder + '/') || ''
                            }
                        ]
                    },
                    {
                        title: _('fred.themes.dependencies'),
                        items: [
                            {
                                html: '<p>' + _('fred.themes.theme_build_dependencies_desc') + '</p>'
                            },
                            {
                                xtype: 'hidden',
                                name: 'dependencies'
                            },
                            {
                                id: 'fred-window-theme-build-dependencies',
                                xtype: 'fred-grid-dependencies',
                                initValue: (config.record && config.record.dependencies) ? config.record.dependencies : [{
                                    name: "fred",
                                    version: '*'
                                }]
                            }
                        ]
                    },
                    {
                        title: _('fred.themes.media_sources'),
                        items: [
                            {
                                html: '<p>' + _('fred.themes.theme_build_media_sources_desc') + '</p>'
                            },
                            {
                                xtype: 'hidden',
                                name: 'mediaSources'
                            },
                            {
                                id: 'fred-window-theme-build-media-sources',
                                xtype: 'fred-grid-theme-build-media-sources',
                                initValue: (config.record && config.record.mediaSources) ? config.record.mediaSources : []
                            }
                        ]
                    },
                    {
                        title: _('fred.themes.changelog'),
                        items: [
                            {
                                html: '<p>' + _('fred.themes.theme_build_changelog_desc') + '</p>'
                            },
                            {
                                xtype: Ext.ComponentMgr.isRegistered('modx-texteditor') ? 'modx-texteditor' : 'textarea',
                                fieldLabel: _('fred.themes.changelog'),
                                name: 'docs_changelog',
                                anchor: '100%',
                                grow: true,
                                growMax: 300,
                                growMin: 200,
                                allowBlank: false
                            }
                        ]
                    },
                    {
                        title: _('fred.themes.readme'),
                        items: [
                            {
                                html: '<p>' + _('fred.themes.theme_build_readme_desc') + '</p>'
                            },
                            {
                                xtype: Ext.ComponentMgr.isRegistered('modx-texteditor') ? 'modx-texteditor' : 'textarea',
                                fieldLabel: _('fred.themes.readme'),
                                name: 'docs_readme',
                                anchor: '100%',
                                grow: true,
                                growMax: 300,
                                growMin: 200,
                                allowBlank: false
                            }
                        ]
                    },
                    {
                        title: _('fred.themes.license'),
                        items: [
                            {
                                html: '<p>' + _('fred.themes.theme_build_license_desc') + '</p>'
                            },
                            {
                                xtype: Ext.ComponentMgr.isRegistered('modx-texteditor') ? 'modx-texteditor' : 'textarea',
                                fieldLabel: _('fred.themes.license'),
                                name: 'docs_license',
                                anchor: '100%',
                                grow: true,
                                growMax: 300,
                                growMin: 200,
                                allowBlank: false
                            }
                        ]
                    }
                ]
            }
        ]
    }
});
Ext.reg('fred-window-theme-build', fred.window.ThemeBuild);

fred.window.RemoveTheme = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        title: _('fred.themes.remove'),
        closeAction: 'close',
        isUpdate: false,
        url: fred.config.connectorUrl,
        action: 'mgr/themes/remove',
        modal: true,
        autoHeight: true,
        animCollapse: false,
        cls: 'x-window-dlg',
        fields: this.getFields(config),
        buttonAlign: 'center',
        buttons: [
            {
                text: _('yes'),
                scope: this,
                handler: this.submit
            },
            {
                text: _('no'),
                scope: this,
                handler: function () {
                    config.closeAction !== 'close' ? this.hide() : this.close();
                }
            }
        ]
    });
    fred.window.RemoveTheme.superclass.constructor.call(this, config);
};
Ext.extend(fred.window.RemoveTheme, MODx.Window, {
    getFields: function (config) {
        return [
            {
                xtype: 'hidden',
                name: 'id'
            },
            {
                html: '<div class=" x-dlg-icon"><div class="ext-mb-icon ext-mb-question"></div><div class="ext-mb-content"><span class="ext-mb-text">' + _('fred.themes.remove_confirm', {name: config.record.name}) + '</span><br></div></div>'
            },
            {
                xtype: 'xcheckbox',
                name: 'delete_theme_folder',
                boxLabel: _('fred.themes.delete_theme_folder'),
                hideLabel: true,
                labelSeparator: ''
            }
        ];
    },

    animShow: function () {
        this.afterShow();
    }
});
Ext.reg('fred-window-remove-theme', fred.window.RemoveTheme);