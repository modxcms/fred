import Editor from './Editor';
import Finder from '../Finder';

export default class ImageEditor extends Editor {
    static title = 'fred.fe.editor.edit_image';

    init() {
        this.state = {
            ...(this.state),
            src: (this.el.src || '')
        }
    }

    render() {
        const wrapper = this.ui.els.div();

        wrapper.appendChild(this.ui.ins.image({
            name: 'src',
            label: 'fred.fe.editor.image_uri',
            ...(Finder.getFinderOptionsFromElement(this.el, true))
        }, this.state.src, this.setStateValue));

        wrapper.appendChild(this.buildAttributesFields());

        return wrapper;
    }

    onSave() {
        Editor.prototype.onSave.call(this);
        this.el.src = this.state.src;
    }
}