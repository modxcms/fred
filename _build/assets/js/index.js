import emitter from './EE';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import fetch from 'isomorphic-fetch';
import drake from './drake';

export default class Fred {
    constructor(config = {}) {
        this.config = config || {};
        this.drake = null;

        document.addEventListener("DOMContentLoaded", () => {
            this.init();
        });
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('fred');

        this.wrapper.addEventListener('click', e => {
            e.stopImmediatePropagation();
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
    
    getDataFromDropzone(dropzone) {
        const data = [];
        
        const clone = dropzone.cloneNode(true);

        let element = clone.querySelector('[data-fred-element-id]');
        while (element) {
            const elementData = {
                widget: element.dataset.fredElementId,
                values: {},
                children: {}
            };

            let dz = element.querySelector('[data-fred-dropzone');

            while (dz) {
                elementData.children[dz.dataset.fredDropzone] = this.getDataFromDropzone(dz);

                dz.remove();
                dz = element.querySelector('[data-fred-dropzone');
            }

            element.querySelectorAll('[contenteditable]').forEach(field => {
                elementData.values[field.dataset.fredName] = field.innerHTML;
            });

            data.push(elementData);

            element.remove();

            element = clone.querySelector('[data-fred-element-id]');
        }
        
        return data;
    }

    save() {
        const data = {};

        for (let i = 0; i < this.dropzones.length; i++) {
                data[this.dropzones[i].dataset.fredDropzone] = this.getDataFromDropzone(this.dropzones[i]);
        }

        console.log('data: ', data);
        
        fetch(`${this.config.assetsUrl}endpoints/ajax.php?action=save-content`, {
            method: "post",
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.config.resource.id,
                data
            })
        }).then(response => {
            return response.json();
        });
    }

    loadContent() {

    }

    init() {
        console.log('Hello from Fred!');

        this.dropzones = document.querySelectorAll('[data-fred-dropzone]:not([data-fred-dropzone=""])');
        let registeredDropzones = [];

        for (let zoneIndex = 0; zoneIndex < this.dropzones.length; zoneIndex++) {
            if (registeredDropzones.indexOf(this.dropzones[zoneIndex].dataset.fredDropzone) != -1) {
                console.error('There are several dropzones with same name: ' + this.dropzones[zoneIndex].dataset.fredDropzone + '. The name of each dropzone has to be unique.');
                return false;
            }

            registeredDropzones.push(this.dropzones[zoneIndex].dataset.fredDropzone);
        }

        emitter.on('fred-hide', () => {
            this.hideFred();
        });
        emitter.on('fred-show', () => {
            this.showFred();
        });
        emitter.on('fred-save', () => {
            this.save();
        });

        this.sidebar = new Sidebar(this.config);
        this.render();

        drake.initDrake();

        this.loadContent();
    }
}
