import Sidebar from '../Sidebar';
import emitter from '../../EE';
import { toggle, text, area, dateTime } from '../../UI/Inputs';
import { dl, dt, dd, form, fieldSet } from '../../UI/Elements';
import Tagger from '../../UI/Tagger';

export default class PageSettings extends Sidebar {
    static title = 'fred.fe.page_settings';
    static icon = 'fred--sidebar_page_settings';
    static expandable = true;

    init() {
        this.setSetting = this.setSetting.bind(this);
        this.setSettingWithEmitter = this.setSettingWithEmitter.bind(this);
        this.addSettingChangeListener = this.addSettingChangeListener.bind(this);

        this.pageSettings = this.fredConfig.pageSettings;
        this.content = this.render();
    }

    click() {
        return this.content;
    }

    render () {
        const settingsForm = form(['fred--page_settings_form']);

        settingsForm.appendChild(this.getGeneralFields());
        settingsForm.appendChild(this.getAdvancedFields());
        settingsForm.appendChild(this.getTaggerFields());

        return settingsForm;
    }

    getGeneralFields() {
        const fields = fieldSet();

        fields.appendChild(text({name: 'pagetitle', label: 'fred.fe.page_settings.page_title'}, this.pageSettings.pagetitle, this.setSettingWithEmitter, this.addSettingChangeListener));
        fields.appendChild(text({name: 'longtitle', label: 'fred.fe.page_settings.long_title'}, this.pageSettings.longtitle, this.setSettingWithEmitter, this.addSettingChangeListener));
        fields.appendChild(area({name: 'description', label: 'fred.fe.page_settings.description'}, this.pageSettings.description, this.setSettingWithEmitter, this.addSettingChangeListener));
        fields.appendChild(area({name: 'introtext', label: 'fred.fe.page_settings.intro_text'}, this.pageSettings.introtext, this.setSettingWithEmitter, this.addSettingChangeListener));
        fields.appendChild(text({name: 'menutitle', label: 'fred.fe.page_settings.menu_title'}, this.pageSettings.menutitle, this.setSettingWithEmitter, this.addSettingChangeListener));
        fields.appendChild(text({name: 'alias', label: 'fred.fe.page_settings.alias'}, this.pageSettings.alias, this.setSettingWithEmitter, this.addSettingChangeListener));
        fields.appendChild(toggle({name: 'published', label: 'fred.fe.page_settings.published'}, this.pageSettings.published, this.setSetting));
        fields.appendChild(toggle({name: 'hidemenu', label: 'fred.fe.page_settings.hide_from_menu'}, this.pageSettings.hidemenu, this.setSetting));

        return fields;
    }

    getAdvancedFields() {
        const advancedList = dl();

        const advancedTab = dt('fred.fe.page_settings.advanced_settings', [], e => {
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
        const fields = fieldSet(['fred--page_settings_form_advanced']);

        fields.appendChild(dateTime({name: 'publishedon', label: 'fred.fe.page_settings.published_on'}, this.pageSettings.publishedon, this.setSetting));
        fields.appendChild(dateTime({name: 'publishon', label: 'fred.fe.page_settings.publish_on'}, this.pageSettings.publishon, this.setSetting));
        fields.appendChild(dateTime({name: 'unpublishon', label: 'fred.fe.page_settings.unpublish_on'}, this.pageSettings.unpublishon, this.setSetting));
        fields.appendChild(text({name: 'menuindex', label: 'fred.fe.page_settings.menu_index'}, this.pageSettings.menuindex, this.setSetting));
        fields.appendChild(toggle({name: 'deleted', label: 'fred.fe.page_settings.deleted'}, this.pageSettings.deleted, this.setSetting));

        advancedContent.appendChild(fields);

        advancedList.appendChild(advancedTab);
        advancedList.appendChild(advancedContent);

        return advancedList;
    }
    
    getTaggerFields() {
        const taggerList = dl();

        const taggerTab = dt('Tagger', [], e => {
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
        const fields = fieldSet(['fred--page_settings_form_advanced']);

        this.fredConfig.tagger.forEach(group => {
            const taggerField = new Tagger(group);
            const rendered = taggerField.render();
            
            if (rendered) {
                fields.appendChild(rendered);
            }
        });

        taggerContent.appendChild(fields);

        taggerList.appendChild(taggerTab);
        taggerList.appendChild(taggerContent);

        return taggerList;
    }

    setSetting(name, value) {
        this.pageSettings[name] = value;
    }

    setSettingWithEmitter(name, value, input) {
        this.setSetting(name, value);

        emitter.emit('fred-page-setting-change', name, value, input);
    }

    addSettingChangeListener(setting, label, input) {
        emitter.on('fred-page-setting-change', (settingName, settingValue, sourceEl) => {
            if ((input !== sourceEl) && (setting.name === settingName)) {
                this.setSetting(settingName, settingValue);
                input.value = settingValue;
            }
        });
    }
}