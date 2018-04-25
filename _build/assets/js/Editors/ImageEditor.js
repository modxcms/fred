import Editor from './Editor';
import Finder from '../Finder';

export default class ImageEditor extends Editor {
    static title = 'Edit Image';

    init() {
        this.state = {
            ...(this.state),
            src: (this.el.src || '')
        }
    }

    render() {
        const wrapper = document.createElement('div');

        wrapper.appendChild(this.ui.buildImageInput({
            name: 'src',
            label: 'Image URI',
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