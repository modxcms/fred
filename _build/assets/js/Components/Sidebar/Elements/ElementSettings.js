import emitter from '../../../EE';
import { debounce } from '../../../Utils';
import ui from '../../../UI/Inputs';
import { div, form, fieldSet, legend, button, dl, dt, dd } from '../../../UI/Elements';

export class ElementSettings {
    constructor() {
        this.el = null;
        this.settings = {};
        this.originalValues = {};
        this.wrapper = null;

        this.render();
        
        emitter.on('fred-element-settings-open', this.openSettings.bind(this));
    }

    render() {
        this.wrapper = div(['fred--panel', 'fred--panel_element', 'fred--hidden']);

        emitter.emit('fred-wrapper-insert', this.wrapper);
    }
    
    openSettings(el) {
        this.el = el;
        this.settings = el.options.settings;
        this.options = el.options;
        this.originalValues = {};
        this.remote = this.options.remote || false;
        this.debouncedRender = debounce(200, this.el.render);

        this.wrapper.innerHTML = '';
        this.wrapper.appendChild(this.renderSettings());

        this.open();
    }
    
    renderSettings() {
        const settingsForm = form();
        const fields = fieldSet();
        const title = legend('Element Settings');

        fields.appendChild(title);

        this.settings.forEach(setting => {
            if (setting.group && setting.settings) {
                fields.appendChild(this.renderSettingsGroup(setting));
            } else {
                const defaultValue = this.el.settings[setting.name] || setting.value;
                this.originalValues[setting.name] = defaultValue;
                fields.appendChild(this.renderSetting(setting, defaultValue));
            }
        });

        const buttonGroup = div(['fred--panel_button_wrapper']);

        const apply = button('Apply', ['fred--btn-panel', 'fred--btn-apply'], this.apply.bind(this));
        const cancel = button('Cancel', ['fred--btn-panel'], () => {
            this.cancel(cancel);
        });

        buttonGroup.appendChild(apply);
        buttonGroup.appendChild(cancel);
        
        fields.appendChild(buttonGroup);

        settingsForm.appendChild(fields);
        
        return settingsForm;
    }

    renderSettingsGroup(group) {
        const content = dl();
        const settingGroup = dt(group.group);
        const settingGroupContent = dd();
        
        group.settings.forEach(setting => {
            const defaultValue = this.el.settings[setting.name] || setting.value;
            this.originalValues[setting.name] = defaultValue;
            settingGroupContent.appendChild(this.renderSetting(setting, defaultValue));
        });

        content.appendChild(settingGroup);
        content.appendChild(settingGroupContent);
        
        return content;
    }

    renderSetting(setting, defaultValue) {
        switch (setting.type) {
            case 'select':
                return ui.select(setting, defaultValue, this.setSetting.bind(this));
            case 'toggle':
                return ui.toggle(setting, defaultValue, this.setSetting.bind(this));
            case 'colorswatch':
                return ui.colorSwatch(setting, defaultValue, this.setSetting.bind(this));
            case 'colorpicker':
                return ui.colorPicker(setting, defaultValue, this.setSetting.bind(this));
            case 'slider':
                return ui.slider(setting, defaultValue, this.setSetting.bind(this));
            case 'page':
                return ui.page(setting, defaultValue, this.setSetting.bind(this));
            case 'image':
                let mediaSource = '';

                if (this.options.mediaSource && this.options.mediaSource !== '') {
                    mediaSource = this.options.mediaSource;
                }

                if (this.options.imageMediaSource && this.options.imageMediaSource !== '') {
                    mediaSource = this.options.imageMediaSource;
                }
                
                return ui.image({mediaSource, ...setting}, defaultValue, this.setSetting.bind(this));
            default:
                return ui.text(setting, defaultValue, this.setSetting.bind(this));        
        }
    }
    
    setSetting(name, value) {
        this.el.settings[name] = value;
        
        if (this.remote === false) {
            this.el.render();
        } else {
            this.debouncedRender();
        }
    }
    
    apply() {
        this.el.render();
        this.close();
    }
    
    settingChanged() {
        for (let name in this.el.settings) {
            if (this.el.settings.hasOwnProperty(name)) {
                if (!(this.originalValues.hasOwnProperty(name) && (this.originalValues[name] === this.el.settings[name]))) {
                   return true; 
                }
            }
        }
        
        return false;
    }
    
    cancel(btn) {
        if(this.settingChanged() && (btn.confirmed !== true)) {
            btn.innerHTML = 'There are unsaved changes, are you sure?';
            btn.confirmed = true;
            return;
        }
        
        this.realCancel();
    }
    
    realCancel() {
        this.el.settings = this.originalValues;
        this.el.render();
        this.close();
    }
    
    open() {
        this.wrapper.classList.remove('fred--hidden');
    }
    
    close() {
        this.wrapper.classList.add('fred--hidden');
    }
}

export default ElementSettings;