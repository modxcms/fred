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
        
        const undo = document.createElement('button');
        undo.classList.add('fred--launcher_btn', 'fred--launcher_btn_undo');
        undo.setAttribute('role', 'button');
        undo.addEventListener('click', e => {
            e.preventDefault();
            emitter.emit('fred-undo');
        });

        wrapper.appendChild(fred);
        wrapper.appendChild(save);
        wrapper.appendChild(undo);

        emitter.emit('fred-wrapper-insert', wrapper);
    }
}