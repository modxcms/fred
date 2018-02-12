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
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.value = img.src;
        
        
        const modal = new Modal(this.fredWrapper, 'Edit Image', input, () => {
            img.src = input.value;
        });

        modal.render();
    }

}

const imageEditor = new ImageEditor();

export default imageEditor;