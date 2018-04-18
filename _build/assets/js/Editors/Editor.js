import Modal from '../Modal';
import UI from '../UI';

export default class Editor {
    static title = 'Edit';
    
    constructor(el) {
        this.el = el;
        this.ui = UI;
        
        this.state = {
            _attributes: {}
        };

        this.setStateValue = this.setStateValue.bind(this);
        this.setStateAttribute = this.setStateAttribute.bind(this);
        
        this.init();

        const wrapper = this.render();
        const modal = new Modal(this.constructor.title, wrapper, this.onSave.bind(this));

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
                this.state._attributes[attr] = this.el.getAttribute(attr || '');
                wrapper.appendChild(this.ui.buildTextInput({name: attr, label: attr}, this.state._attributes[attr], this.setStateAttribute));
            });
        }
        
        return wrapper;
    }
}