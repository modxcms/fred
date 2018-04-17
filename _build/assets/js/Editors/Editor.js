import Modal from '../Modal';

export default class Editor {
    constructor(el) {
        this.el = el;
        this.state = {
            _attributes: {}
        };
        
        this.init();

        const wrapper = this.render();
        const modal = new Modal('Edit Icon', wrapper, this.onSave.bind(this));

        modal.render();        
    }
    
    init() {
        
    }
    
    render() {
        
    }

    onStateUpdate() {

    }
    
    onSave() {
        for (let attr in this.state._attributes) {
            if (this.state._attributes.hasOwnProperty(attr)) {
                this.el.setAttribute(attr, this.state._attributes[attr]);
            }
        }
    }

    setStateAttribute(attr, value) {
        this.state._attributes[attr] = value;
        this.onStateUpdate();
    }

    setStateValue(name, value) {
        this.state[name] = value;
        this.onStateUpdate();
    }

    buildAttributesFields() {
        const wrapper = document.createElement('div');
        
        if (this.el.dataset.fredAttrs) {
            const attrs = this.el.dataset.fredAttrs.split(',');
            attrs.forEach(attr => {
                const field = document.createElement('input');
                field.setAttribute('type', 'text');
                field.value = this.el.getAttribute(attr || '');
                
                this.state._attributes[attr] = field.value;

                field.addEventListener('keyup', () => {
                    this.setStateAttribute(attr, field.value);
                });

                wrapper.appendChild(this.labelWrapper(field, attr));
            });
        }
        
        return wrapper;
    }

    buildSelectInput(setting, defaultValue) {
        const wrapper = document.createElement('div');

        const label = document.createElement('label');
        label.innerHTML = setting.label || setting.name;

        const select = document.createElement('select');

        if (setting.options) {
            for (let value in setting.options) {
                if (setting.options.hasOwnProperty(value)) {
                    const option = document.createElement('option');
                    option.innerHTML = setting.options[value];
                    option.value = value;

                    if (value === this.state[setting.name]) {
                        option.setAttribute('selected', 'selected');
                    }

                    select.appendChild(option);
                }
            }
        }

        select.addEventListener('change', e => {
            if (setting.options[select.value]) {
                this.setStateValue(setting.name, select.value);
            }
        });

        wrapper.appendChild(label);
        wrapper.appendChild(select);

        return wrapper;
    }

    buildToggleInput(setting) {
        const wrapper = document.createElement('div');

        const label = document.createElement('label');
        label.classList.add('fred--toggle');
        label.innerHTML = setting.label || setting.name;

        const input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        if (this.state[setting.name] === true) {
            input.setAttribute('checked', 'checked');
        }

        input.addEventListener('change', e => {
            this.setStateValue(setting.name, e.target.checked);
        });

        const span = document.createElement('span');

        label.appendChild(input);
        label.appendChild(span);

        wrapper.appendChild(label);

        return wrapper;
    }
    
    labelWrapper(input, name) {
        const label = document.createElement('label');
        label.innerText = name;

        label.appendChild(input);

        return label;
    }
}