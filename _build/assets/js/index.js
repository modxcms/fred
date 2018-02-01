import emitter from './EE';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import fetch from 'isomorphic-fetch';

export default class Fred {
    constructor(config = {}) {
        this.config = config || {};
        
        document.addEventListener("DOMContentLoaded", () => {
            this.init();
        });
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
    
    save() {
        const data = {};
        
        for (let i = 0; i < this.dropzones.length; i++) {
            if (!data[this.dropzones[i].dataset.fredDropzone]) {
                data[this.dropzones[i].dataset.fredDropzone] = [];
            }

            this.dropzones[i].querySelectorAll('[data-fred-id]').forEach(item => {
                const values = {};
                
                item.querySelectorAll('[contenteditable]').forEach(field => {
                    values[field.dataset.fredName] = field.innerHTML;    
                });

                data[this.dropzones[i].dataset.fredDropzone].push({
                    widget: item.dataset.fredId,
                    values
                });
            })
        }

        fetch(`${this.config.assetsUrl}endpoints/ajax.php?action=save-content`, {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        console.log(data);
    }
    
    loadContent() {
        let content = localStorage.getItem('fred-content');
        if (content) {
            try {
                content = JSON.parse(content);
                console.log(content);
            } catch (err) {
                console.error('Failed to parse stored state.');
            } 
        }
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

        emitter.on('fred-hide', () => {this.hideFred();});
        emitter.on('fred-show', () => {this.showFred();});
        emitter.on('fred-save', () => {this.save();});
        
        this.sidebar = new Sidebar(this.config);
        this.render();

        this.loadContent();
    }
}