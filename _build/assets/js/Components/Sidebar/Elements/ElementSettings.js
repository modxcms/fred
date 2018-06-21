import emitter from '../../../EE';
import { debounce } from '../../../Utils';
import ui from '../../../UI/Inputs';
import { div, form, fieldSet, legend, button, dl, dt, dd } from '../../../UI/Elements';
import fredConfig from '../../../Config';

export class ElementSettings {
    constructor() {
        this.el = null;
        this.settings = {};
        this.originalValues = {};
        this.wrapper = null;

        this.render();
        
        emitter.on('fred-element-settings-open', this.openSettings.bind(this));

        emitter.on('fred-element-settings-dt-active', (tab, content) => {
            const listener = e => {
                if ((e.target.parentElement !== null) && !content.contains(e.target)) {
                    tab.classList.remove('active');
                    this.wrapper.removeEventListener('click', listener);
                }
            };

            this.wrapper.addEventListener('click', listener);
        });
    }

    render() {
        this.wrapper = div(['fred--panel', 'fred--panel_element', 'fred--hidden']);

        emitter.emit('fred-wrapper-insert', this.wrapper);
    }
    
    openSettings(el) {
        this.el = el;
        this.settings = el.options.settings;
        this.options = el.options;
        this.originalValues = JSON.parse(JSON.stringify(this.el.settings));
        this.remote = this.options.remote || false;
        this.debouncedRender = debounce(200, this.el.render);

        this.wrapper.innerHTML = '';
        this.wrapper.appendChild(this.renderSettings());

        this.open();
    }
    
    renderSettings() {
        const settingsForm = form();
        const fields = fieldSet();
        const title = legend('fred.fe.element_settings');

        fields.appendChild(title);

        this.settings.forEach(setting => {
            if (setting.group && setting.settings) {
                const group = dl();
                this.renderSettingsGroup(setting, group);
                fields.appendChild(group);
            } else {
                const defaultValue = this.el.settings[setting.name] || setting.value;
                fields.appendChild(this.renderSetting(setting, defaultValue));
            }
        });
       
        const buttonGroup = div(['fred--panel_button_wrapper']);

        const apply = button('fred.fe.apply', 'fred.fe.apply', ['fred--btn-panel', 'fred--btn-apply'], this.apply.bind(this));
        const cancel = button('fred.fe.cancel', 'fred.fe.cancel', ['fred--btn-panel'], () => {
            this.cancel(cancel);
        });

        buttonGroup.appendChild(apply);
        buttonGroup.appendChild(cancel);
        
        fields.appendChild(buttonGroup);

        settingsForm.appendChild(fields);
        
        return settingsForm;
    }

    renderSettingsGroup(group, content) {
        const settingGroup = dt(group.group, [], (e, el) => {
            const activeTabs = el.parentElement.querySelectorAll('dt.active');

            const isActive = el.classList.contains('active');

            for (let tab of activeTabs) {
                tab.classList.remove('active');
            }

            if (!isActive) {
                el.classList.add('active');
                e.stopPropagation();
                emitter.emit('fred-element-settings-dt-active', settingGroup, settingGroupContent);
            }
        });
        const settingGroupContent = dd();
        
        group.settings.forEach(setting => {
            const defaultValue = this.el.settings[setting.name] || setting.value;
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
            case 'tagger':
                return ui.tagger(setting, defaultValue, this.setSetting.bind(this));
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
        this.el.render().then(() => {
            const event = new CustomEvent('FredElementSettingChange', { detail: {fredEl: this.el} });
            document.body.dispatchEvent(event);
            
            const jsEls = this.el.wrapper.querySelectorAll('[data-fred-on-setting-change]');
            for (let jsEl of jsEls) {
                
                if (window[jsEl.dataset.fredOnSettingChange]) {
                    window[jsEl.dataset.fredOnSettingChange]();
                }
            }
        });

        this.close();
    }
    
    settingChanged() {
        return this.compareObjects(this.el.settings, this.originalValues);
    }
    
    compareObjects(o1, o2) {
        for (let name in o1) {
            if (o1.hasOwnProperty(name)) {
                if (typeof o1[name] === 'object') {
                    return this.compareObjects(o1[name], o2[name]);    
                } else {
                    if (!(o2.hasOwnProperty(name) && (o2[name] === o1[name]))) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    cancel(btn) {
        if (!this.settingChanged()) {
            this.close();
            return;
        }
        
        if(btn.confirmed !== true) {
            btn.innerHTML = fredConfig.lng('fred.fe.element_settings.unsaved_changes');
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