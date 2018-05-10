import emitter from './EE';
import { div, button } from './UI/Elements';

export default class Launcher {
    constructor(position = 'bottom_left') {
        this.position = position;
        this.previewMode = false;
        
        this.render();
    }
    
    render() {
        const wrapper = div(['fred--launcher', `fred--launcher_${this.position}`]);

        const fred = button('', ['fred--launcher_btn', 'fred--launcher_btn_fred'], () => {
            emitter.emit('fred-sidebar-toggle');
        });

        const save = button('', ['fred--launcher_btn', 'fred--launcher_btn_save'], () => {
            emitter.emit('fred-save');
        });
        
        const preview = button('', ['fred--launcher_btn', 'fred--launcher_btn_preview'], () => {
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

        emitter.on('fred-sidebar-hide', silent => {
            if (silent !== true) {
                wrapper.classList.remove('fred--hidden');
            }
        });

        emitter.on('fred-sidebar-show', silent => {
            if (silent !== true) {
                wrapper.classList.add('fred--hidden');
            }
        });

        emitter.emit('fred-wrapper-insert', wrapper);
    }
}