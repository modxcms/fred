import Editor from './Editor';
import ContentElement from "../Components/Sidebar/Elements/ContentElement";

export default class IconEditor extends Editor {
    static title = 'fred.fe.editor.edit_icon';
    
    init() {
        this.state = {
            ...(this.state),
            icon: (ContentElement.getElValue(this.el) || '')
        };
    }

    render() {
        const wrapper = this.ui.els.div();

        wrapper.appendChild(this.ui.ins.text({name: 'icon', label: 'fred.fe.editor.icon'}, this.state.icon, this.setStateValue));
        wrapper.appendChild(this.buildAttributesFields());
        
        return wrapper;
    }

    onSave() {
        Editor.prototype.onSave.call(this);

        this.el.fredEl.setElValue(this.el, this.state.icon);
    }
}