import SidebarPlugin from '../SidebarPlugin';
import emitter from '../../EE';
import { dl, dt, dd, h3, form, fieldSet } from '../../UI/Elements';
import Tagger from '../../UI/Tagger';
import ui from "../../UI/Inputs";
import { valueParser } from "../../Utils";
import fredConfig from "../../Config";

export default class PageSettings extends SidebarPlugin {
    static title = 'fred.fe.page_settings';
    static icon = 'fred--sidebar_page_settings';
    static expandable = true;

    init() {
        this.setSetting = this.setSetting.bind(this);
        this.setSettingWithEmitter = this.setSettingWithEmitter.bind(this);
        this.addSettingChangeListener = this.addSettingChangeListener.bind(this);
        this.setTVWithEmitter = this.setTVWithEmitter.bind(this);
        this.addTVChangeListener = this.addTVChangeListener.bind(this);

        this.pageSettings = fredConfig.pageSettings;
        this.content = this.render();
    }

    click() {
        return this.content;
    }

    render () {
        const settingsForm = form(['fred--page_settings_form']);

        settingsForm.appendChild(this.getGeneralFields());

        if (fredConfig.permission.fred_settings_advanced) {
            settingsForm.appendChild(this.getAdvancedFields());
        }

        if (fredConfig.permission.fred_settings_tags) {
            if (fredConfig.tagger.length > 0) {
                settingsForm.appendChild(this.getTaggerFields());
            }
        }

        if (fredConfig.permission.fred_settings_tvs) {
            if (fredConfig.tvs.length > 0) {
                settingsForm.appendChild(this.getTVFields());
            }
        }

        return settingsForm;
    }

    getGeneralFields() {
        const fields = fieldSet();

        fields.appendChild(ui.text({name: 'pagetitle', label: 'fred.fe.page_settings.page_title'}, this.pageSettings.pagetitle, this.setSettingWithEmitter, this.addSettingChangeListener));
        fields.appendChild(ui.text({name: 'longtitle', label: 'fred.fe.page_settings.long_title'}, this.pageSettings.longtitle, this.setSettingWithEmitter, this.addSettingChangeListener));
        fields.appendChild(ui.area({name: 'description', label: 'fred.fe.page_settings.description'}, this.pageSettings.description, this.setSettingWithEmitter, this.addSettingChangeListener));
        fields.appendChild(ui.area({name: 'introtext', label: 'fred.fe.page_settings.intro_text'}, this.pageSettings.introtext, this.setSettingWithEmitter, this.addSettingChangeListener));
        fields.appendChild(ui.text({name: 'menutitle', label: 'fred.fe.page_settings.menu_title'}, this.pageSettings.menutitle, this.setSettingWithEmitter, this.addSettingChangeListener));

        const aliasField = ui.text({name: 'alias', label: 'fred.fe.page_settings.alias'}, this.pageSettings.alias, this.setSettingWithEmitter, this.addSettingChangeListener);
        fields.appendChild(aliasField);

        const publishedToggle = ui.toggle({name: 'published', label: 'fred.fe.page_settings.published'}, this.pageSettings.published, (name, value) => {this.setSetting(name, value)});

        if (!(fredConfig.permission.publish_document && fredConfig.resource.publish) && !this.pageSettings.published) {
            publishedToggle.inputEl.setAttribute('disabled', 'disabled');
        }

        if (!(fredConfig.permission.unpublish_document && fredConfig.resource.unpublish) && this.pageSettings.published) {
            publishedToggle.inputEl.setAttribute('disabled', 'disabled');
        }

        fields.appendChild(publishedToggle);
        fields.appendChild(ui.toggle({name: 'hidemenu', label: 'fred.fe.page_settings.hide_from_menu'}, this.pageSettings.hidemenu, (name, value) => {this.setSetting(name, value)}));

        emitter.on('fred-after-save', () => {
            if (!(fredConfig.permission.publish_document && fredConfig.resource.publish) && !this.pageSettings.published) {
                publishedToggle.inputEl.setAttribute('disabled', 'disabled');
            }

            if (!(fredConfig.permission.unpublish_document && fredConfig.resource.unpublish) && this.pageSettings.published) {
                publishedToggle.inputEl.setAttribute('disabled', 'disabled');
            }

            aliasField.inputEl.value = this.pageSettings.alias;
        });

        return fields;
    }

    getAdvancedFields() {
        const advancedList = dl();

        const advancedTab = dt('fred.fe.page_settings.advanced_settings', ['fred--accordion-cog'], e => {
            const activeTabs = advancedList.parentElement.querySelectorAll('dt.active');

            const isActive = advancedTab.classList.contains('active');

            for (let tab of activeTabs) {
                tab.classList.remove('active');
            }

            if (!isActive) {
                advancedTab.classList.add('active');
                e.stopPropagation();
                emitter.emit('fred-sidebar-dt-active', advancedTab, advancedContent);
            }

        });

        const advancedContent = dd();
        const advancedHeader = h3('fred.fe.page_settings.advanced_settings');
        const fields = fieldSet(['fred--page_settings_form_advanced']);
        const publishedOn = ui.dateTime({name: 'publishedon', label: 'fred.fe.page_settings.published_on'}, this.pageSettings.publishedon, (name, value) => {this.setSetting(name, value)});

        fields.appendChild(publishedOn);
        fields.appendChild(ui.dateTime({name: 'publishon', label: 'fred.fe.page_settings.publish_on'}, this.pageSettings.publishon, (name, value) => {this.setSetting(name, value)}));
        fields.appendChild(ui.dateTime({name: 'unpublishon', label: 'fred.fe.page_settings.unpublish_on'}, this.pageSettings.unpublishon, (name, value) => {this.setSetting(name, value)}));
        fields.appendChild(ui.text({name: 'menuindex', label: 'fred.fe.page_settings.menu_index'}, this.pageSettings.menuindex, (name, value) => {this.setSetting(name, value)}));

        const deletedToggle = ui.toggle({name: 'deleted', label: 'fred.fe.page_settings.deleted'}, this.pageSettings.deleted, (name, value) => {this.setSetting(name, value)});

        if (!(fredConfig.permission.delete_document && fredConfig.resource.delete) && !this.pageSettings.deleted) {
            deletedToggle.inputEl.setAttribute('disabled', 'disabled');
        }

        if (!(fredConfig.permission.undelete_document && fredConfig.resource.undelete) && this.pageSettings.deleted) {
            deletedToggle.inputEl.setAttribute('disabled', 'disabled');
        }

        fields.appendChild(deletedToggle);
        advancedContent.appendChild(advancedHeader);
        advancedContent.appendChild(fields);
        advancedList.appendChild(advancedTab);
        advancedList.appendChild(advancedContent);

        emitter.on('fred-after-save', () => {
            if (!(fredConfig.permission.delete_document && fredConfig.resource.delete) && !this.pageSettings.deleted) {
                deletedToggle.inputEl.setAttribute('disabled', 'disabled');
            }

            if (!(fredConfig.permission.undelete_document && fredConfig.resource.undelete) && this.pageSettings.deleted) {
                deletedToggle.inputEl.setAttribute('disabled', 'disabled');
            }

            if (this.pageSettings.publishedon) {
                publishedOn.picker.setDate(this.pageSettings.publishedon * 1000);
            } else {
                publishedOn.picker.clear();
            }
        });

        return advancedList;
    }

    getTaggerFields() {
        const taggerList = dl();

        const taggerTab = dt('fred.fe.tagger.tagger', ['fred--accordion-cog'], e => {
            const activeTabs = taggerList.parentElement.querySelectorAll('dt.active');

            const isActive = taggerTab.classList.contains('active');

            for (let tab of activeTabs) {
                tab.classList.remove('active');
            }

            if (!isActive) {
                taggerTab.classList.add('active');
                e.stopPropagation();
                emitter.emit('fred-sidebar-dt-active', taggerTab, taggerContent);
            }
        });

        const taggerContent = dd();
        const fields = fieldSet(['fred--page_tagger']);
        const taggerHeader = h3('fred.fe.tagger.tagger');

        fredConfig.tagger.forEach(group => {
            const taggerField = new Tagger(group, null, () => {
                emitter.emit('fred-content-changed');
            });
            const rendered = taggerField.render();

            if (rendered) {
                fields.appendChild(rendered);
            }
        });

        taggerContent.appendChild(taggerHeader);
        taggerContent.appendChild(fields);
        taggerList.appendChild(taggerTab);
        taggerList.appendChild(taggerContent);

        return taggerList;
    }

    getTVFields() {
        const tvList = dl();

        const tvTab = dt('fred.fe.page_settings.tvs', ['fred--accordion-cog'], e => {
            const activeTabs = tvList.parentElement.querySelectorAll('dt.active');

            const isActive = tvTab.classList.contains('active');

            for (let tab of activeTabs) {
                tab.classList.remove('active');
            }

            if (!isActive) {
                tvTab.classList.add('active');
                e.stopPropagation();
                emitter.emit('fred-sidebar-dt-active', tvTab, tvContent);
            }
        });

        const tvContent = dd();
        const fields = fieldSet(['fred--page_settings_form_advanced']);

        fredConfig.tvs.forEach(tv => {
            switch (tv.type) {
                case 'image':
                    fields.appendChild(ui.image(tv, this.pageSettings.tvs[tv.name], this.setTVWithEmitter, this.addTVChangeListener));
                    break;
                case 'textarea':
                    fields.appendChild(ui.area(tv, this.pageSettings.tvs[tv.name], this.setTVWithEmitter, this.addTVChangeListener));
                    break;
                default:
                    fields.appendChild(ui.text(tv, this.pageSettings.tvs[tv.name], this.setTVWithEmitter, this.addTVChangeListener));
            }
        });

        tvContent.appendChild(fields);

        tvList.appendChild(tvTab);
        tvList.appendChild(tvContent);

        return tvList;
    }

    setSetting(name, value, namespace = null) {
        if (namespace) {
            if (!this.pageSettings[namespace]) this.pageSettings[namespace] = {};

            if (this.pageSettings[namespace][name] !== value) {
                emitter.emit('fred-content-changed');
            }

            this.pageSettings[namespace][name] = value;
        } else {
            if (this.pageSettings[name] !== value) {
                emitter.emit('fred-content-changed');
            }

            this.pageSettings[name] = value;
        }
    }

    setSettingWithEmitter(name, value, input) {
        this.setSetting(name, value);

        emitter.emit('fred-page-setting-change', name, value, valueParser(value), input);
    }

    addSettingChangeListener(setting, label, input) {
        emitter.on('fred-page-setting-change', (settingName, settingValue, parsedValue, sourceEl) => {
            if ((input !== sourceEl) && (setting.name === settingName)) {
                this.setSetting(settingName, settingValue);
                input.value = settingValue;
            }
        });
    }

    setTVWithEmitter(name, value, input) {
        this.setSetting(name, value, 'tvs');

        emitter.emit('fred-page-setting-change', 'tv_' + name, value, valueParser(value), input);
    }

    addTVChangeListener(setting, label, input) {
        emitter.on('fred-page-setting-change', (settingName, settingValue, parsedValue, sourceEl) => {

            if ((input !== sourceEl) && (('tv_' + setting.name) === settingName)) {
                this.setSetting(setting.name, settingValue, 'tvs');
                input.value = settingValue;

                if (label.setPreview && (typeof label.setPreview === 'function')) {
                    label.setPreview(input.value);
                }
            }
        });
    }
}
