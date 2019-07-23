import Editor from './Editor';
import Element from "../Content/Element";
import { div } from '../UI/Elements';
import { text } from '../UI/Inputs';

export default class IconEditor extends Editor {
    static title = 'fred.fe.editor.edit_icon';

    init() {
        this.state = {
            ...(this.state),
            icon: (Element.getElValue(this.el) || '')
        };
    }

    render() {
        const wrapper = div();

        wrapper.appendChild(text({name: 'icon', label: 'fred.fe.editor.icon'}, this.state.icon, this.setStateValue));
        wrapper.appendChild(this.buildAttributesFields());

        return wrapper;
    }

    onSave() {
        Editor.prototype.onSave.call(this);

        this.el.fredEl.setElValue(this.el, this.state.icon);
    }
}
