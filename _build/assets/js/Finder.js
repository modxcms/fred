import emitter from './EE';
import fredConfig from './Config';
import { section, div, button, h4, iFrame } from './UI/Elements';

export class Finder {
    constructor(onSelect = (file, fm) => {}, title = 'fred.fe.browse_files', options = {}) {
        this.wrapper = null;

        if (fredConfig.lngExists(title)) {
            title = fredConfig.lng(title);
        }

        this.title = title;
        this.options = {
            width: '800px',
            height: '600px',
            ...options
        };

        this.onSelect = onSelect.bind(this);
    }

    render() {
        this.wrapper = section(['fred--modal-bg']);

        const modal = div(['fred--modal']);
        modal.setAttribute('aria-hidden', 'true');

        const header = div(['fred--modal-header']);

        const close = button('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="-4 -4 20 20" enable-background="new -4 -4 20 20" xml:space="preserve"><polygon points="16.079,-0.666 12.717,-4.027 6.052,2.637 -0.613,-4.027 -3.975,-0.666 2.69,6 -3.975,12.664 -0.612,16.026 6.052,9.362 12.717,16.027 16.079,12.664 9.414,6 "></polygon></svg>', 'fred.fe.close', ['button'], this.close.bind(this));

        this.titleEl = h4(this.title);

        this.body = div(['fred--modal-body']);

        modal.style.width = this.options.width || '800px';
        modal.style.height = this.options.height || '600px';
        this.body.style.padding = '0';
        console.log(fredConfig);
        const finderOptions = [
            `fredToken=${fredConfig.jwt}`,
            `modx=${fredConfig.config.modxVersion}`
        ];

        if (this.options.mediaSource) {
            finderOptions.push(`mediaSource=${this.options.mediaSource}`);
        }

        if (this.options.type) {
            finderOptions.push(`type=${this.options.type}`);
            window.getLexicon = (key) => {
                return fredConfig.lng(key)
            }
        }

        if (this.options.showOnlyFolders !== undefined) {
            finderOptions.push(`showOnlyFolders=${this.options.showOnlyFolders}`);
        }

        let finderOptionsString = '';
        if (finderOptions.length > 0) {
            finderOptionsString = '?' + finderOptions.join('&');
        }

        const finderIframe = iFrame(`${fredConfig.config.assetsUrl}elfinder/index.html` + finderOptionsString);

        finderIframe.style.width = '100%';
        finderIframe.style.height = '100%';

        this.body.appendChild(finderIframe);

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

    static getFinderOptionsFromElement(el, imageFinder = false) {
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
