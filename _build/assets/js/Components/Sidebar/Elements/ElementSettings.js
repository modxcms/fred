import emitter from '../../../EE';

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
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('fred--panel', 'fred--panel_element', 'fred--hidden');

        emitter.emit('fred-wrapper-insert', this.wrapper);
    }
    
    openSettings(el) {
        this.el = el;
        this.settings = el.options.settings;
        this.originalValues = {};

        this.wrapper.innerHTML = '';
        this.wrapper.appendChild(this.renderSettings());

        this.open();
    }
    
    renderSettings() {
        const form = document.createElement('form');
        const fieldSet = document.createElement('fieldset');

        const legend = document.createElement('legend');
        legend.innerHTML = 'Element Settings';

        fieldSet.appendChild(legend);

        this.settings.forEach(setting => {
            if (setting.group && setting.settings) {
                fieldSet.appendChild(this.renderSettingsGroup(setting));
            } else {
                const defaultValue = this.el.settings[setting.name] || setting.value;
                this.originalValues[setting.name] = defaultValue;
                fieldSet.appendChild(this.renderSetting(setting, defaultValue));
            }
        });

        const apply = document.createElement('button');
        apply.classList.add('fred--btn-panel', 'fred--btn-apply');
        apply.innerHTML = 'Apply';
        apply.addEventListener('click', e => {
            e.preventDefault();
            this.apply();
        });

        const cancel = document.createElement('button');
        cancel.classList.add('fred--btn-panel');
        cancel.innerHTML = 'Cancel';
        cancel.addEventListener('click', e => {
            e.preventDefault();
            this.cancel(cancel);
        });

        fieldSet.appendChild(apply);
        fieldSet.appendChild(cancel);

        form.appendChild(fieldSet);
        
        return form;
    }

    renderSettingsGroup(group) {
        const content = document.createElement('dl');

        const dt = document.createElement('dt');
        dt.setAttribute('role', 'tab');
        dt.setAttribute('tabindex', '1');
        dt.innerHTML = group.group;

        const dd = document.createElement('dd');
        group.settings.forEach(setting => {
            const defaultValue = this.el.settings[setting.name] || setting.value;
            this.originalValues[setting.name] = defaultValue;
            dd.appendChild(this.renderSetting(setting, defaultValue));
        });

        content.appendChild(dt);
        content.appendChild(dd);
        
        return content;
    }

    renderSetting(setting, defaultValue) {
        const label = document.createElement('label');
        label.innerHTML = setting.label || setting.name;
        
        switch (setting.type) {
            case 'select':
                label.appendChild(this.buildSelectInput(setting, defaultValue));
                break;
            default:
                label.appendChild(this.buildTextInput(setting, defaultValue));        
        }
        
        return label;
    }
    
    buildTextInput(setting, defaultValue) {
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.value = defaultValue;

        input.addEventListener('keyup', e => {
            this.setSetting(setting.name, input.value);
        });
        
        return input;
    }
    
    buildSelectInput(setting, defaultValue) {
        const select = document.createElement('select');
        
        if (setting.options) {
            for (let value in setting.options) {
                if (setting.options.hasOwnProperty(value)) {
                    const option = document.createElement('option');
                    option.innerHTML = setting.options[value];
                    option.value = value;
                    
                    if (value === defaultValue) {
                        option.setAttribute('selected', 'selected');
                    }

                    select.appendChild(option);                    
                }
            }
        }
        
        select.addEventListener('change', e => {
            if (setting.options[select.value]) {
                this.setSetting(setting.name, select.value);
            }
        });
        
        return select;
    }
    
    setSetting(name, value) {
        this.el.settings[name] = value;
        this.el.reRender();
    }
    
    apply() {
        this.el.reRender();
        this.close();
    }
    
    settingChanged() {
        for (let name in this.el.settings) {
            if (this.el.settings.hasOwnProperty(name)) {
                if (!(this.originalValues[name] && (this.originalValues[name] === this.el.settings[name]))) {
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
        this.el.reRender();
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