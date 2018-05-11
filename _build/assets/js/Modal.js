import emitter from './EE';
import { section, div, button, h4 } from './UI/Elements';
import fredConfig from "./Config";

export class Modal {
    
    constructor(title, content = '', onSave = () => {}) {
        this.wrapper = null;

        if (fredConfig.lngExists(title)) {
            title = fredConfig.lng(title);
        }
        
        this.title = title;
        this.content = content;
        this.onSave = onSave;
    }
    
    setTitle(title) {
        this.title = title;
        
        if (this.wrapper !== null) {
            this.titleEl.innerHTML = title;
        }
    }
    
    setContent(content) {
        this.content = content;

        if (this.wrapper !== null) {
            if (typeof this.content === 'string') {
                this.body.innerHTML = this.content;
            } else {
                this.body.innerHTML = '';
                this.body.appendChild(this.content);
            }
        }
    }
    
    render() {
        this.wrapper = section(['fred--modal-bg']);
        
        const modal = div(['fred--modal']);
        modal.setAttribute('aria-hidden', 'true');

        const header = div(['fred--modal-header']);

        const close = button('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="-4 -4 20 20" enable-background="new -4 -4 20 20" xml:space="preserve"><polygon points="16.079,-0.666 12.717,-4.027 6.052,2.637 -0.613,-4.027 -3.975,-0.666 2.69,6 -3.975,12.664 -0.612,16.026 6.052,9.362 12.717,16.027 16.079,12.664 9.414,6 "></polygon></svg>', 'fred.fe.close', ['button'], this.close.bind(this));

        this.titleEl = h4(this.title);

        this.body = div(['fred--modal-body']);
        
        if (typeof this.content === 'string') {
            this.body.innerHTML = this.content;
        } else {
            this.body.appendChild(this.content);
        }

        const footer = div(['fred--modal-footer']);

        const save = button('Save', ['fred--btn-small'], () => {
            this.onSave();
            this.close();
        });
        
        header.appendChild(close);
        header.appendChild(this.titleEl);
        
        footer.appendChild(save);

        modal.appendChild(header);
        modal.appendChild(this.body);
        
        modal.appendChild(footer);

        this.wrapper.appendChild(modal);

        emitter.emit('fred-wrapper-insert', this.wrapper);
        
        return this.wrapper;
    }
    
    close() {
        this.wrapper.remove();
    }
}

export default Modal;