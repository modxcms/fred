import Sidebar from '../Sidebar';
import emitter from '../../EE';
import flatpickr from "flatpickr";

export default class PageSettings extends Sidebar {
    static title = 'Page Settings';
    static expandable = true;

    init() {
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
        
        fieldset.appendChild(this.buildTextInput('pagetitle', 'Page Title'));
        fieldset.appendChild(this.buildTextInput('longtitle', 'Long Title'));
        fieldset.appendChild(this.buildTextAreaInput('description', 'Description'));
        fieldset.appendChild(this.buildTextAreaInput('introtext', 'Intro Text'));
        fieldset.appendChild(this.buildTextInput('menutitle', 'Menu Title'));
        fieldset.appendChild(this.buildTextInput('alias', 'Alias'));
        fieldset.appendChild(this.buildToggleInput('published', 'Published'));
        fieldset.appendChild(this.buildToggleInput('hidemenu', 'Hide from Menu'));
        
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
        
        fieldset.appendChild(this.buildDateTimeInput('publishedon', 'Published On'));
        fieldset.appendChild(this.buildDateTimeInput('publishon', 'Publish On'));
        fieldset.appendChild(this.buildDateTimeInput('unpublishon', 'Unpublish On'));
        fieldset.appendChild(this.buildToggleInput('deleted', 'Deleted'));

        dd.appendChild(fieldset);

        dl.appendChild(dt);
        dl.appendChild(dd);
        
        return dl;
    }
    
    buildTextInput(name, label) {
        const labelEl = document.createElement('label');
        labelEl.innerHTML = label;

        const input = document.createElement('input');
        input.type = 'text';
        input.value = this.pageSettings[name];

        input.addEventListener('keyup', e => {
            this.pageSettings[name] = input.value;
            
            emitter.emit('fred-page-setting-change', name, input.value, input);
        });

        emitter.on('fred-page-setting-change', (settingName, settingValue, sourceEl) => {
            if ((input !== sourceEl) && (name === settingName)) {
                this.pageSettings[settingName] = settingValue;
                input.value = settingValue;
            }
        });

        labelEl.appendChild(input);
        
        return labelEl;
    }
    
    buildTextAreaInput(name, label) {
        const labelEl = document.createElement('label');
        labelEl.innerHTML = label;

        const textarea = document.createElement('textarea');
        textarea.innerHTML = this.pageSettings[name];

        textarea.addEventListener('keyup', e => {
            this.pageSettings[name] = textarea.value;

            emitter.emit('fred-page-setting-change', name, textarea.value, textarea);
        });

        emitter.on('fred-page-setting-change', (settingName, settingValue, sourceEl) => {
            if ((textarea !== sourceEl) && (name === settingName)) {
                this.pageSettings[settingName] = settingValue;
                textarea.value = settingValue;
            }
        });

        labelEl.appendChild(textarea);
        
        return labelEl;
    }
    
    buildToggleInput(name, label) {
        const labelEl = document.createElement('label');
        labelEl.classList.add('fred--page_settings_form_checkbox', 'fred--toggle');
        labelEl.innerHTML = label;

        const input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        if (this.pageSettings[name] === true) {
            input.setAttribute('checked', 'checked');
        }

        input.addEventListener('change', e => {
            this.pageSettings[name] = e.target.checked;
        });

        const span = document.createElement('span');

        labelEl.appendChild(input);
        labelEl.appendChild(span);

        return labelEl;
    }
    
    buildDateTimeInput(name, label) {
        const labelEl = document.createElement('label');
        labelEl.innerHTML = label;

        const input = document.createElement('input');
        
        flatpickr(input, {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            defaultDate: (this.pageSettings[name] === 0) ? '' : (this.pageSettings[name] * 1000),
            onChange: selectedDates => {
                this.pageSettings[name] = selectedDates[0].getTime() / 1000
            }
        });

        labelEl.appendChild(input);

        return labelEl;
    }

}