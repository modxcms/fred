import { debounce } from '../../../Utils';
import ui from '../../../UI/Inputs';
import { div, form, fieldSet, legend, button, dl, dt, dd } from '../../../UI/Elements';
import fredConfig from '../../../Config';
import utilitySidebar from './../../UtilitySidebar';

export class ElementSettings {
    constructor() {
        this.el = null;
        this.settings = {};
        this.originalValues = {};
        this.wrapper = null;

        this.dtActive = this.dtActive.bind(this);
        this.open = this.open.bind(this);
    }
    
    open(el) {
        this.el = el;
        this.settings = el.options.settings;
        this.options = el.options;
        this.originalValues = JSON.parse(JSON.stringify(this.el.settings));
        this.remote = this.options.remote || false;
        this.debouncedRender = debounce(200, this.el.render);

        utilitySidebar.open(this.render());
    }
    
    render() {
        const settingsForm = form();
        const fields = fieldSet();
        const title = legend('fred.fe.element_settings', ['fred--panel_element']);

        fields.appendChild(title);

        this.settings.forEach(setting => {
            if (setting.group && setting.settings) {
                const groupEl = this.renderSettingsGroup(setting);
                if (groupEl !== false) {
                    fields.appendChild(groupEl);
                }
            } else {
                const defaultValue = (this.el.settings[setting.name] === undefined) ? setting.value : this.el.settings[setting.name];
                const settingEl = this.renderSetting(setting, defaultValue);
                if (settingEl !== false) {
                    fields.appendChild(settingEl);
                }
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

    dtActive(tab, content) {
        const listener = e => {
            if ((e.target.parentElement !== null) && !content.contains(e.target)) {
                tab.classList.remove('active');
                utilitySidebar.wrapper.removeEventListener('click', listener);
            }
        };

        utilitySidebar.wrapper.addEventListener('click', listener);
    }

    renderSettingsGroup(group) {
        if (this.checkUserGroup(group) === false) return false;
        
        const content = dl();
        
        const settingGroup = dt(group.group, [], (e, el) => {
            const activeTabs = content.parentElement.querySelectorAll('dt.active');

            const isActive = el.classList.contains('active');

            for (let tab of activeTabs) {
                tab.classList.remove('active');
            }

            if (!isActive) {
                el.classList.add('active');
                e.stopPropagation();
                this.dtActive(settingGroup, settingGroupContent);
            }
        });
        const settingGroupContent = dd();
        
        group.settings.forEach(setting => {
            const defaultValue = (this.el.settings[setting.name] === undefined) ? setting.value : this.el.settings[setting.name];
            const settingEl = this.renderSetting(setting, defaultValue);
            if (settingEl !== false) {
                settingGroupContent.appendChild(settingEl);
            }
        });

        content.appendChild(settingGroup);
        content.appendChild(settingGroupContent);
        
        return content;
    }

    renderSetting(setting, defaultValue) {
        if (this.checkUserGroup(setting) === false) return false;
        
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
    
    checkUserGroup(setting) {
        let match = true;
        
        if (setting.userGroup && Array.isArray(setting.userGroup)) {
            const matchAll = setting.userGroupMatchAll || false;
            match = false;
            
            for (const userGroup of setting.userGroup) {
                if ((typeof userGroup === 'object') && userGroup.group) {
                    if (fredConfig.membership[userGroup.group] !== undefined) {
                        if (userGroup.role) {
                            if (fredConfig.role[userGroup.role] === undefined) return false;

                            if (fredConfig.membership[userGroup.group] <= fredConfig.role[userGroup.role]) {
                                match = true;
                                if (matchAll === false) break;
                                continue;
                            }
                            
                            match = false;
                            if (matchAll === true) return false;
                            continue;
                        }

                        match = true;
                        if (matchAll === false) break;
                        continue;
                    }

                    match = false;
                    if (matchAll === true) return false;
                    
                    continue;
                }
                
                if (typeof userGroup === 'string') {
                    if (fredConfig.membership[userGroup] !== undefined) {
                        match = true;
                        if (matchAll === false) break;
                        continue;
                    }

                    match = false;
                    if (matchAll === true) return false;
                    
                    continue;
                }
             
                return false;
            }
        }
        
        return match;
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
                    window[jsEl.dataset.fredOnSettingChange](this.el);
                }
            }
        });

        utilitySidebar.close();
    }
    
    settingChanged() {
        return this.compareObjects(this.el.settings, this.originalValues);
    }
    
    compareObjects(o1, o2) {
        for (let name in o1) {
            if (o1.hasOwnProperty(name)) {
                if (typeof o1[name] === 'object') {
                    const nestedCompare = this.compareObjects(o1[name], o2[name]);
                    if (nestedCompare === true) return true;
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
            utilitySidebar.close();
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
        utilitySidebar.close();
    }
}

const elementSettings = new ElementSettings();
export default elementSettings;