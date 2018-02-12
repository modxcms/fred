export class Modal {
    
    constructor(title, content = '', onSave = () => {}) {
        this.wrapper = null;
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
            this.body.innerHTML = content;
        }
    }
    
    render() {
        this.wrapper = document.createElement('section');
        this.wrapper.classList.add('fred--modal-bg');
        
        const modal = document.createElement('div');
        modal.classList.add('fred--modal');
        modal.setAttribute('aria-hidden', 'true');

        const header = document.createElement('div');
        header.classList.add('fred--modal-header');

        const close = document.createElement('button');
        close.classList.add('button');
        close.innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="-4 -4 20 20" enable-background="new -4 -4 20 20" xml:space="preserve"><polygon points="16.079,-0.666 12.717,-4.027 6.052,2.637 -0.613,-4.027 -3.975,-0.666 2.69,6 -3.975,12.664 -0.612,16.026 6.052,9.362 12.717,16.027 16.079,12.664 9.414,6 "></polygon></svg>';
        close.addEventListener('click', this.close.bind(this));

        this.titleEl = document.createElement('h4');
        this.titleEl.innerHTML = this.title;

        this.body = document.createElement('div');
        this.body.classList.add('fred--modal-body');
        this.body.innerHTML = this.content;

        const footer = document.createElement('div');
        footer.classList.add('fred--modal-footer');

        const save = document.createElement('button');
        save.classList.add('fred--btn-small');
        save.setAttribute('type', 'button');
        save.innerHTML = 'Save';
        save.addEventListener('click', e => {
            e.preventDefault();
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
        
        return this.wrapper;
    }
    
    close() {
        this.wrapper.remove();
    }
}

export default Modal;