import Modal from '../Modal';
import UI from '../UI';
import fredConfig from '../Config';

export default class Editor {
    static title = 'fred.fe.editor.edit';
    
    constructor(el) {
        this.el = el;
        this.ui = UI;
        this.config = fredConfig.config;
        
        this.state = {
            _attributes: {}
        };

        this.setStateValue = this.setStateValue.bind(this);
        this.setStateAttribute = this.setStateAttribute.bind(this);
        
        this.init();

        const wrapper = this.render();
        
        const title = fredConfig.lngExists(this.constructor.title) ? fredConfig.lng(this.constructor.title) : this.constructor.title;
        const modal = new Modal(title, wrapper, this.onSave.bind(this));

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
        const wrapper = this.ui.els.div();
        
        if (this.el.dataset.fredAttrs) {
            const attrs = this.el.dataset.fredAttrs.split(',');
            attrs.forEach(attr => {
                this.state._attributes[attr] = this.el.getAttribute(attr || '');
                wrapper.appendChild(this.ui.ins.text({name: attr, label: attr}, this.state._attributes[attr], this.setStateAttribute));
            });
        }
        
        return wrapper;
    }
}