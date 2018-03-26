import emitter from './EE';
import Sidebar from './Sidebar';
import Launcher from './Launcher';
import fetch from 'isomorphic-fetch';
import drake from './Drake';
import imageEditor from './Editors/ImageEditor';
import iconEditor from './Editors/IconEditor';
import ContentElement from './Components/Sidebar/Elements/ContentElement';
import ElementSettings from './Components/Sidebar/Elements/ElementSettings';

export default class Fred {
    constructor(config = {}) {
        this.config = config || {};
        this.drake = null;
        this.loading = null;
        this.wrapper = null;
        this.config.pageSettings = {};

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

        document.body.appendChild(this.wrapper);
    }
    
    renderComponents() {
        new Launcher((this.config.launcherPosition || 'bottom_left'));
        new Sidebar(this.config);
        new ElementSettings();        
    }

    getDataFromDropZone(dropZone) {
        const data = [];

        for (let child of dropZone.children) {
            data.push(child.fredEl.getContent());
        }

        return data;
    }

    getCleanDropZoneContent(dropZone) {
        let cleanedContent = '';

        for (let child of dropZone.children) {
            cleanedContent += child.fredEl.cleanRender().innerHTML;
        }

        return cleanedContent;
    }

    save() {
        emitter.emit('fred-loading', 'Saving Page');
        const body = {};
        const data = {};

        for (let i = 0; i < this.dropzones.length; i++) {
            data[this.dropzones[i].dataset.fredDropzone] = this.getDataFromDropZone(this.dropzones[i]);

            const targets = this.dropzones[i].querySelectorAll('[data-fred-target]:not([data-fred-target=""])');
            for (let target of targets) {
                if (!this.config.pageSettings.hasOwnProperty(target.dataset.fredTarget)) {
                    body[target.dataset.fredTarget] = target.innerHTML;
                }
            }

            body[this.dropzones[i].dataset.fredDropzone] = this.getCleanDropZoneContent(this.dropzones[i]);
        }

        body.id = this.config.resource.id;
        body.data = data;
        body.pageSettings = this.config.pageSettings;

        console.log('body: ', body);
        
        fetch(`${this.config.assetsUrl}endpoints/ajax.php?action=save-content`, {
            method: "post",
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(response => {
            return response.json();
        }).then(json => {
            if (json.url) {
                location.href = json.url;
            }
            
            emitter.emit('fred-loading-hide');

        });
    }

    loadContent() {
        emitter.emit('fred-loading', 'Preparing Content');
        
        return fetch(`${this.config.assetsUrl}endpoints/ajax.php?action=load-content&id=${this.config.resource.id}`, {
            credentials: 'same-origin'
        }).then(response => {
            return response.json();
        }).then(json => {
            const zones = json.data.data;
            this.config.pageSettings = json.data.pageSettings || {};

            for (let zoneName in zones) {
                if (zones.hasOwnProperty(zoneName)) {
                    const zoneEl = document.querySelector(`[data-fred-dropzone="${zoneName}"]`);
                    if (zoneEl) {
                        zoneEl.innerHTML = '';
                        zones[zoneName].forEach(element => {
                            const chunk = document.createElement('div');
                            chunk.classList.add('chunk');
                            chunk.setAttribute('hidden', 'hidden');
                            chunk.dataset.fredElementId = element.widget;
                            chunk.innerHTML = json.data.elements[element.widget].html;
                            chunk.elementOptions = json.data.elements[element.widget].options;

                            const contentElement = new ContentElement(this.config, chunk, zoneName, null, element.values, (element.settings || {}));
                            this.loadChildren(element.children, contentElement, json.data.elements);

                            zoneEl.appendChild(contentElement.wrapper);

                        });
                    }
                }
            }

            drake.reloadContainers();

            emitter.emit('fred-loading-hide');
        });
    }

    loadChildren(zones, parent, elements) {
        for (let zoneName in zones) {
            if (zones.hasOwnProperty(zoneName)) {
                zones[zoneName].forEach(element => {
                    const chunk = document.createElement('div');
                    chunk.classList.add('chunk');
                    chunk.setAttribute('hidden', 'hidden');
                    chunk.dataset.fredElementId = element.widget;
                    chunk.innerHTML = elements[element.widget].html;
                    chunk.elementOptions = elements[element.widget].options || {};
                    
                    const contentElement = new ContentElement(this.config, chunk, zoneName, parent, element.values, (element.settings || {}));
                    parent.addElementToDropZone(zoneName, contentElement);

                    this.loadChildren(element.children, contentElement, elements);
                });
            }
        }
    }
    
    registerListeners() {
        emitter.on('fred-save', () => {
            this.save();
        });

        emitter.on('fred-wrapper-insert', el => {
            this.wrapper.appendChild(el);
        });

        emitter.on('fred-loading', text => {
            if (this.loading !== null) return;

            text = text || '';

            this.loading = document.createElement('section');
            this.loading.classList.add('fred--modal-bg');

            this.loading.innerHTML = `<div class="fred--modal" aria-hidden="false"><div style="color:white;text-align:center;"><span class="fred--loading"></span> ${text}</div></div>`;

            this.wrapper.appendChild(this.loading);
        });

        emitter.on('fred-loading-hide', () => {
            if (this.loading !== null) {
                this.loading.remove();
                this.loading = null;
            }
        });

        emitter.on('fred-undo', () => {
            console.log('Undo not yet implemented.');
        });
    }

    init() {
        console.log('Hello from Fred!');
        
        this.registerListeners();

        this.dropzones = document.querySelectorAll('[data-fred-dropzone]:not([data-fred-dropzone=""])');
        let registeredDropzones = [];

        for (let zoneIndex = 0; zoneIndex < this.dropzones.length; zoneIndex++) {
            if (registeredDropzones.indexOf(this.dropzones[zoneIndex].dataset.fredDropzone) != -1) {
                console.error('There are several dropzones with same name: ' + this.dropzones[zoneIndex].dataset.fredDropzone + '. The name of each dropzone has to be unique.');
                return false;
            }

            registeredDropzones.push(this.dropzones[zoneIndex].dataset.fredDropzone);
        }

        this.render();
        drake.initDrake(this.config);
        imageEditor.init(this.wrapper);
        iconEditor.init(this.wrapper);

        this.loadContent().then(() => {
            this.renderComponents();
        });
    }
}
