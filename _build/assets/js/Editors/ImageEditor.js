import Modal from '../Modal';

class ImageEditor {
    constructor() {
        this.fredWrapper = null;
        this.inited = false;
    }

    init(fredWrapper) {
        if (this.inited === true) return;

        this.fredWrapper = fredWrapper;
        this.inited = true;
    }

    edit(img) {
        const wrapper = document.createElement('div');
        
        
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.value = img.src || '';

        const fields = [];

        if (img.dataset.fredAttrs) {
            const attrs = img.dataset.fredAttrs.split(',');
            attrs.forEach(attr => {
                const field = document.createElement('input');
                field.dataset.name = attr;
                field.setAttribute('type', 'text');
                field.value = img.getAttribute(attr || '');

                fields.push(field);
            });
        }

        wrapper.appendChild(this.labelWrapper(input, 'src'));
        
        fields.forEach(field => {
            wrapper.appendChild(this.labelWrapper(field, field.dataset.name));    
        });


        const modal = new Modal(this.fredWrapper, 'Edit Image', wrapper, () => {
            img.src = input.value;

            fields.forEach(field => {
                img.setAttribute(field.dataset.name, field.value);
            });
        });

        modal.render();
    }
    
    labelWrapper(input, name) {
        const label = document.createElement('label');
        label.innerText = name;
        
        label.appendChild(input);
        
        return label;
    }

}

const imageEditor = new ImageEditor();

export default imageEditor;