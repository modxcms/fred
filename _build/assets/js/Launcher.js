import emitter from './EE';

export default class Launcher {
    constructor(position = 'bottom_left') {
        this.position = position;
        this.previewMode = false;
        
        this.render();
    }
    
    render() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('fred--launcher', `fred--launcher_${this.position}`);

        const fred = document.createElement('button');
        fred.classList.add('fred--launcher_btn', 'fred--launcher_btn_fred');
        fred.setAttribute('role', 'button');
        fred.addEventListener('click', e => {
            e.preventDefault();
            emitter.emit('fred-sidebar-toggle');
        });
        
        const save = document.createElement('button');
        save.classList.add('fred--launcher_btn', 'fred--launcher_btn_save');
        save.setAttribute('role', 'button');
        save.addEventListener('click', e => {
            e.preventDefault();
            emitter.emit('fred-save');
        });
        
        const preview = document.createElement('button');
        preview.classList.add('fred--launcher_btn', 'fred--launcher_btn_preview');
        preview.setAttribute('role', 'button');
        preview.addEventListener('click', e => {
            e.preventDefault();
            if (this.previewMode === false) {
                this.previewMode = true;
                wrapper.style.zIndex = '9999999999';
                fred.style.display = 'none';
                save.style.display = 'none';
                preview.classList.add('active');
                emitter.emit('fred-preview-on');
            } else {
                this.previewMode = false;
                wrapper.style.zIndex = '';
                fred.style.display = '';
                save.style.display = '';
                preview.classList.remove('active');
                emitter.emit('fred-preview-off');
            }
        });

        wrapper.appendChild(fred);
        wrapper.appendChild(save);
        wrapper.appendChild(preview);

        emitter.emit('fred-wrapper-insert', wrapper);
    }
}