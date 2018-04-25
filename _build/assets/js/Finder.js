import emitter from './EE';

export class Finder {

    constructor(url, onSelect = (file, fm) => {}, title = 'Browse Files', options = {}) {
        this.wrapper = null;
        this.title = title;
        this.options = {
            width: '800px', 
            height: '600px',
            ...options
        };
        
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

        modal.style.width = this.options.width || '800px';
        modal.style.height = this.options.height || '600px';
        this.body.style.padding = '0';

        const iframe = document.createElement('iframe');

        const finderOptions = [];
        if (this.options.mediaSource) {
            finderOptions.push(`mediaSource=${this.options.mediaSource}`);
        }

        let finderOptionsString = '';
        if (finderOptions.length > 0) {
            finderOptionsString = '?' + finderOptions.join('&');
        }
        
        iframe.src = this.url + finderOptionsString;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        
        this.body.appendChild(iframe);
        
        header.appendChild(close);
        header.appendChild(this.titleEl);

        modal.appendChild(header);
        modal.appendChild(this.body);

        this.wrapper.appendChild(modal);

        window.fredFinderOnChange = (file, fm) => {
            this.onSelect(file, fm);
            this.close();
        };

        emitter.emit('fred-wrapper-insert', this.wrapper);

        return this.wrapper;
    }

    close() {
        delete window.fredFinderOnChange;
        
        this.wrapper.remove();
    }
    
    static getFinderOptions(el, imageFinder = false) {
        const options = {};

        let mediaSource = '';

        if (el.fredEl.options.mediaSource && el.fredEl.options.mediaSource !== '') {
            mediaSource = el.fredEl.options.mediaSource;
        }

        if (imageFinder && el.fredEl.options.imageMediaSource && el.fredEl.options.imageMediaSource !== '') {
            mediaSource = el.fredEl.options.imageMediaSource;
        }

        if (el.dataset.fredMediaSource && el.dataset.fredMediaSource !== '') {
            mediaSource = el.dataset.fredMediaSource;
        }

        if (imageFinder && el.dataset.fredImageMediaSource && el.dataset.fredImageMediaSource !== '') {
            mediaSource = el.dataset.fredImageMediaSource;
        }

        if (mediaSource !== '') {
            options.mediaSource = mediaSource;
        }

        return options;
    }
}

export default Finder;