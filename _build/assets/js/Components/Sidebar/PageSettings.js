import Sidebar from '../Sidebar';
import emitter from '../../EE';
import { buildToggleInput, buildTextInput, buildTextAreaInput, buildDateTimeInput } from '../../UI';

export default class PageSettings extends Sidebar {
    static title = 'Page Settings';
    static expandable = true;

    init() {
        this.setSetting = this.setSetting.bind(this);
        this.setSettingWithEmitter = this.setSettingWithEmitter.bind(this);
        this.addSettingChangeListener = this.addSettingChangeListener.bind(this);
        
        this.pageSettings = this.config.pageSettings;
        this.content = this.render();
    }

    click() {
        return this.content;
    }
    
    render () {
        const form = document.createElement('form');
        form.classList.add('fred--page_settings_form');

        form.appendChild(this.getGeneralFields());
        form.appendChild(this.getAdvancedFields());

        const save = document.createElement('button');
        save.setAttribute('type', 'button');
        save.classList.add('fred--btn-sidebar', 'fred--settings_form_save');
        save.innerText = 'Save';

        save.addEventListener('click', e => {
            e.preventDefault();
            emitter.emit('fred-save');
        });

        form.appendChild(save);
        
        return form;
    }
    
    getGeneralFields() {
        const fieldset = document.createElement('fieldset');
        
        fieldset.appendChild(buildTextInput({name: 'pagetitle', label: 'Page Title'}, this.pageSettings.pagetitle, this.setSettingWithEmitter, this.addSettingChangeListener));
        fieldset.appendChild(buildTextInput({name: 'longtitle', label: 'Long Title'}, this.pageSettings.longtitle, this.setSettingWithEmitter, this.addSettingChangeListener));
        fieldset.appendChild(buildTextAreaInput({name: 'description', label: 'Description'}, this.pageSettings.description, this.setSettingWithEmitter, this.addSettingChangeListener));
        fieldset.appendChild(buildTextAreaInput({name: 'introtext', label: 'Intro Text'}, this.pageSettings.introtext, this.setSettingWithEmitter, this.addSettingChangeListener));
        fieldset.appendChild(buildTextInput({name: 'menutitle', label: 'Menu Title'}, this.pageSettings.menutitle, this.setSettingWithEmitter, this.addSettingChangeListener));
        fieldset.appendChild(buildTextInput({name: 'alias', label: 'Alias'}, this.pageSettings.alias, this.setSettingWithEmitter, this.addSettingChangeListener));
        fieldset.appendChild(buildToggleInput({name: 'published', label: 'Published'}, this.pageSettings.published, this.setSetting));
        fieldset.appendChild(buildToggleInput({name: 'hidemenu', label: 'Hide from Menu'}, this.pageSettings.hidemenu, this.setSetting));
        
        return fieldset;
    }

    getAdvancedFields() {
        const dl = document.createElement('dl');
        
        const dt = document.createElement('dt');
        dt.setAttribute('role', 'tab');
        dt.setAttribute('tabindex', '0');
        dt.innerHTML = 'Advanced Settings';

        dt.addEventListener('click', e => {
            e.preventDefault();
            dt.classList.toggle('active');
        });

        const dd = document.createElement('dd');
        const fieldset = document.createElement('fieldset');
        fieldset.classList.add('fred--page_settings_form_advanced');
        
        fieldset.appendChild(buildDateTimeInput({name: 'publishedon', label: 'Published On'}, this.pageSettings.publishedon, this.setSetting));
        fieldset.appendChild(buildDateTimeInput({name: 'publishon', label: 'Publish On'}, this.pageSettings.publishon, this.setSetting));
        fieldset.appendChild(buildDateTimeInput({name: 'unpublishon', label: 'Unpublish On'}, this.pageSettings.unpublishon, this.setSetting));
        fieldset.appendChild(buildTextInput({name: 'menuindex', label: 'Menu Index'}, this.pageSettings.menuindex, this.setSetting));
        fieldset.appendChild(buildToggleInput({name: 'deleted', label: 'Deleted'}, this.pageSettings.deleted, this.setSetting));

        dd.appendChild(fieldset);

        dl.appendChild(dt);
        dl.appendChild(dd);
        
        return dl;
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