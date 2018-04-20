import Editor from './Editor';
import Modal from '../Modal';

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

        const openFinder = document.createElement('button');
        
        wrapper.appendChild(this.ui.buildTextInput({name: 'src', label: 'Image URI'}, this.state.src, this.setStateValue, (setting, label, input) => {
            openFinder.addEventListener('click', e => {
                e.preventDefault();

                this.openFinder(input);
            });
        }));
        
        
        openFinder.innerText = 'Browse';
        openFinder.classList.add('fred--btn-small');

        

        wrapper.appendChild(openFinder);
        wrapper.appendChild(this.buildAttributesFields());
        
        return wrapper;
    }
    
    openFinder(input) {
        const iframe = document.createElement('iframe');
        iframe.src = `${this.config.assetsUrl}/elfinder/index.html`;
        iframe.style.width = '100%';
        iframe.style.height = '100%';

        const modal = new Modal('Browser Images', iframe, () => {}, true);
        
        window.fredEditorOnChange = (file, fm) => {
            this.setStateValue('src', file.url);
            input.value = file.url;
            
            modal.close();
            delete window.fredEditorOnChange;
        };

        modal.render();
    }
    
    onSave() {
        Editor.prototype.onSave.call(this);
        this.el.src = this.state.src;
    }
}