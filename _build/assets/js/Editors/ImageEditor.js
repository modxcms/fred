import Editor from './Editor';

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

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.value = this.state.src;
        
        input.addEventListener('keyup', () => {
            this.setStateValue('src', input.value);
        });

        wrapper.appendChild(this.labelWrapper(input, 'src'));
        
        wrapper.appendChild(this.buildAttributesFields());
        
        return wrapper;
    }
    
    onSave() {
        Editor.prototype.onSave.call(this);
        this.el.src = this.state.src;
    }
}