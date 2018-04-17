import emitter from './EE';

export default class Launcher {
    constructor(position = 'bottom_left') {
        this.position = position;

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
            emitter.emit('fred-preview');
        });

        wrapper.appendChild(fred);
        wrapper.appendChild(save);
        wrapper.appendChild(preview);

        emitter.emit('fred-wrapper-insert', wrapper);
    }
}