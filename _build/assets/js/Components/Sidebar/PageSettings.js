import Sidebar from '../Sidebar';
import emitter from '../../EE';
import { toggle, text, area, dateTime } from '../../UI/Inputs';
import { button, dl, dt, dd, form, fieldSet } from '../../UI/Elements';

export default class PageSettings extends Sidebar {
    static title = 'Page Settings';
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

        const save = button('Save', ['fred--btn-sidebar', 'fred--settings_form_save'], () => {
            emitter.emit('fred-save');
        });

        settingsForm.appendChild(save);
        
        return settingsForm;
    }
    
    getGeneralFields() {
        const fields = fieldSet();
        
        fields.appendChild(text({name: 'pagetitle', label: 'Page Title'}, this.pageSettings.pagetitle, this.setSettingWithEmitter, this.addSettingChangeListener));
        fields.appendChild(text({name: 'longtitle', label: 'Long Title'}, this.pageSettings.longtitle, this.setSettingWithEmitter, this.addSettingChangeListener));
        fields.appendChild(area({name: 'description', label: 'Description'}, this.pageSettings.description, this.setSettingWithEmitter, this.addSettingChangeListener));
        fields.appendChild(area({name: 'introtext', label: 'Intro Text'}, this.pageSettings.introtext, this.setSettingWithEmitter, this.addSettingChangeListener));
        fields.appendChild(text({name: 'menutitle', label: 'Menu Title'}, this.pageSettings.menutitle, this.setSettingWithEmitter, this.addSettingChangeListener));
        fields.appendChild(text({name: 'alias', label: 'Alias'}, this.pageSettings.alias, this.setSettingWithEmitter, this.addSettingChangeListener));
        fields.appendChild(toggle({name: 'published', label: 'Published'}, this.pageSettings.published, this.setSetting));
        fields.appendChild(toggle({name: 'hidemenu', label: 'Hide from Menu'}, this.pageSettings.hidemenu, this.setSetting));
        
        return fields;
    }

    getAdvancedFields() {
        const advancedList = dl();
        
        const advancedTab = dt('Advanced Settings', [], () => {
            advancedTab.classList.toggle('active');
        });

        const advancedContent = dd();
        const fields = fieldSet(['fred--page_settings_form_advanced']);
        
        fields.appendChild(dateTime({name: 'publishedon', label: 'Published On'}, this.pageSettings.publishedon, this.setSetting));
        fields.appendChild(dateTime({name: 'publishon', label: 'Publish On'}, this.pageSettings.publishon, this.setSetting));
        fields.appendChild(dateTime({name: 'unpublishon', label: 'Unpublish On'}, this.pageSettings.unpublishon, this.setSetting));
        fields.appendChild(text({name: 'menuindex', label: 'Menu Index'}, this.pageSettings.menuindex, this.setSetting));
        fields.appendChild(toggle({name: 'deleted', label: 'Deleted'}, this.pageSettings.deleted, this.setSetting));

        advancedContent.appendChild(fields);

        advancedList.appendChild(advancedTab);
        advancedList.appendChild(advancedContent);
        
        return advancedList;
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