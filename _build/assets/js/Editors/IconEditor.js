import Editor from './Editor';

export default class IconEditor extends Editor {
    init() {
        this.state = {
            ...(this.state),
            icon: (this.el.className || '')
        };
    }

    render() {
        const wrapper = document.createElement('div');

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.value = this.state.icon;
        
        input.addEventListener('keyup', () => {
            this.setStateValue('icon', input.value);
        });

        wrapper.appendChild(this.labelWrapper(input, 'class'));

        wrapper.appendChild(this.buildAttributesFields());
        
        return wrapper;
    }

    onSave() {
        Editor.prototype.onSave.call(this);
        
        this.el.className = this.state.icon;
    }
}