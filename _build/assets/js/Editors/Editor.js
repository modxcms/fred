import Modal from '../Modal';
import fredConfig from '../Config';
import { div } from '../UI/Elements';
import ui from '../UI';

export default class Editor {
    static title = 'fred.fe.editor.edit';

    constructor(el) {
        this.el = el;

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
                this.el.fredEl.setElValue(this.el, this.state._attributes[attr], attr);
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
        const wrapper = div();

        if (this.el.dataset.fredAttrs) {
            const attrs = this.el.dataset.fredAttrs.split(',');
            attrs.forEach(attr => {
                this.state._attributes[attr] = this.el.getAttribute(attr || '');
                wrapper.appendChild(ui.ins.text({name: attr, label: attr}, this.state._attributes[attr], this.setStateAttribute));
            });
        }

        return wrapper;
    }
}
