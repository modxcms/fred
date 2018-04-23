import emitter from './EE';

export class Finder {

    constructor(url, onSelect = (file, fm) => {}, title = 'Browse Files', width = '800px', height = '600px') {
        this.wrapper = null;
        this.title = title;
        this.width = width;
        this.height = height;
        this.url = url;
        this.onSelect = onSelect.bind(this);
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

        modal.style.width = this.width;
        modal.style.height = this.height;
        this.body.style.padding = '0';

        const iframe = document.createElement('iframe');
        iframe.src = this.url;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        
        this.body.appendChild(iframe);
        
        header.appendChild(close);
        header.appendChild(this.titleEl);

        modal.appendChild(header);
        modal.appendChild(this.body);

        this.wrapper.appendChild(modal);

        window.fredEditorOnChange = (file, fm) => {
            this.onSelect(file, fm);
            this.close();
            delete window.fredEditorOnChange;
        };

        emitter.emit('fred-wrapper-insert', this.wrapper);

        return this.wrapper;
    }

    close() {
        this.wrapper.remove();
    }
}

export default Finder;