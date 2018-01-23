import emitter from './EE';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default class Fred {
    constructor(config = {}) {
        this.init();
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('fred');

        this.wrapper.addEventListener('click', e => {
            e.stopPropagation();
        });

        new Topbar(this.wrapper);
        this.sidebar.render(this.wrapper);

        if (document.body.firstChild === null) {
            document.body.appendChild(this.wrapper);
        } else {
            document.body.insertBefore(this.wrapper, document.body.firstChild);
        }
    }

    showFred() {
        this.wrapper.removeAttribute('hidden');
    }

    hideFred() {
        this.wrapper.setAttribute('hidden', 'hidden');
    }

    init() {
        console.log('Hello from Fred!');

        const dropzones = document.querySelectorAll('[data-fred-dropzone]:not([data-fred-dropzone=""])');
        let registeredDropzones = [];

        for (let zoneIndex = 0; zoneIndex < dropzones.length; zoneIndex++) {
            if (registeredDropzones.indexOf(dropzones[zoneIndex].dataset.fredDropzone) != -1) {
                console.error('There are several dropzones with same name: ' + dropzones[zoneIndex].dataset.fredDropzone + '. The name of each dropzone has to be unique.');
                return false;
            }

            registeredDropzones.push(dropzones[zoneIndex].dataset.fredDropzone);
        }

        emitter.on('fred-hide', () => {this.hideFred();});
        emitter.on('fred-show', () => {this.showFred();});
        
        this.sidebar = new Sidebar();
        this.render();
    }
}