import emitter from './EE';
import { div, button } from './UI/Elements';
import fredConfig from './Config';

export default class Launcher {
    constructor(position = 'bottom_left') {
        this.position = position;
        this.previewMode = false;
        this.hidden = false;
        
        this.render();
    }
    
    render() {
        const wrapper = div(['fred--launcher', `fred--launcher_${this.position}`]);

        const fred = button('', 'fred.fe.open_sidebar', ['fred--launcher_btn', 'fred--launcher_btn_fred'], () => {
            emitter.emit('fred-sidebar-toggle');
        });

        const save = button('', 'fred.fe.save', ['fred--launcher_btn', 'fred--launcher_btn_save'], () => {
            emitter.emit('fred-save');
        });
        
        if (!fredConfig.permission.save_document) {
            save.setAttribute('disabled', 'disabled');
        }
        
        const preview = button('', 'fred.fe.toggle_preview', ['fred--launcher_btn', 'fred--launcher_btn_preview'], () => {
            if (this.previewMode === false) {
                emitter.emit('fred-preview-on');
            } else {
                emitter.emit('fred-preview-off');
            }
        });

        wrapper.appendChild(fred);
        wrapper.appendChild(save);
        wrapper.appendChild(preview);

        if (fredConfig.permission.fred_elements) {
            const element = button('', 'fred.fe.elements', ['fred--launcher_btn', 'fred--launcher_btn_elements'], () => {
                emitter.emit('fred-sidebar-toggle');
                let elements = document.querySelectorAll("dt.fred--sidebar_elements")[0];
                if (!elements.classList.contains('active')) {
                    elements.click();
                }
            });

            wrapper.appendChild(element);
        }
        
        emitter.on('fred-sidebar-hide', silent => {
            if (silent !== true) {
                this.hidden = false;
                wrapper.classList.remove('fred--hidden');
            }
        });

        emitter.on('fred-sidebar-show', silent => {
            if (silent !== true) {
                this.hidden = true;
                wrapper.classList.add('fred--hidden');
            }
        });
        
        emitter.on('fred-preview-on', () => {
            this.previewMode = true;
            wrapper.style.zIndex = '9999999999';
            fred.style.display = 'none';
            save.style.display = 'none';
            preview.classList.add('active');
            
            if (this.hidden) {
                wrapper.classList.remove('fred--hidden');
            }
        });
        
        emitter.on('fred-preview-off', () => {
            this.previewMode = false;
            wrapper.style.zIndex = '';
            fred.style.display = '';
            save.style.display = '';
            preview.classList.remove('active');

            if (this.hidden) {
                wrapper.classList.add('fred--hidden');
            }
        });

        emitter.emit('fred-wrapper-insert', wrapper);
    }
}