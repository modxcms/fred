import emitter from './EE';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import fetch from 'isomorphic-fetch';
import drake from './drake';
import Elements from './Components/Sidebar/Elements';

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
    
    getDataFromDropZone(dropZone) {
        const data = [];
        
        const clone = dropZone.cloneNode(true);

        let element = clone.querySelector('[data-fred-element-id]');
        while (element) {
            const elementData = {
                widget: element.dataset.fredElementId,
                values: {},
                children: {}
            };

            let dz = element.querySelector('[data-fred-dropzone');

            while (dz) {
                elementData.children[dz.dataset.fredDropzone] = this.getDataFromDropZone(dz);

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

    getCleanDropZoneContent(dropZone) {
        const clone = dropZone.cloneNode(true);
        
        // Remove fred--block wrappers
        let fredBlock = clone.querySelector('.fred--block');
        while(fredBlock) {
            const content = fredBlock.querySelector('.fred--block_content');
            
            const children = content.children;
            
            const sibling = fredBlock.nextSibling;
            const parent = fredBlock.parentNode;
            
            fredBlock.remove();
            
            if (sibling) {
                while(children.length > 0) {
                    if (parent) {
                        parent.insertBefore(children[0], sibling);       
                    } else {
                        clone.insertBefore(children[0], sibling);
                    }
                }
            } else if (parent) {
                while(children.length > 0) {
                    parent.appendChild(children[0]);
                }
            }
            
            fredBlock = clone.querySelector('.fred--block');
        }
        
        // Remove contenteditable, data-fred-name & data-fred-target attributes
        const contentEditables = clone.querySelectorAll('[contenteditable]');
        for (let el of contentEditables) {
            el.removeAttribute('contentEditable');
            el.removeAttribute('data-fred-name');
            el.removeAttribute('data-fred-target');
        }
        
        // Remove data-fred-dropzone attributes
        const dropzones = clone.querySelectorAll('[data-fred-dropzone]');
        for (let el of dropzones) {
            el.removeAttribute('data-fred-dropzone');
            el.removeAttribute('data-fred-dropzone');
            el.removeAttribute('data-fred-dropzone');
        }
        
        return clone.innerHTML.trim();
    }
    
    save() {
        const body = {};
        const data = {};

        for (let i = 0; i < this.dropzones.length; i++) {
            data[this.dropzones[i].dataset.fredDropzone] = this.getDataFromDropZone(this.dropzones[i]);
            
            const targets = this.dropzones[i].querySelectorAll('[data-fred-target]:not([data-fred-target=""])');
            for (let target of targets) {
                body[target.dataset.fredTarget] = target.innerHTML;
            }
            
            body[this.dropzones[i].dataset.fredDropzone] = this.getCleanDropZoneContent(this.dropzones[i]);
        }
        
        body.id = this.config.resource.id;
        body.data = data;

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
        });
    }

    loadContent() {
        fetch(`${this.config.assetsUrl}endpoints/ajax.php?action=load-content&id=${this.config.resource.id}&XDEBUG_SESSION_START=phpstorm`, {
            credentials: 'same-origin'
        }).then(response => {
            return response.json();
        }).then(json => {
            const zones = json.data.data;
            
            for (let zoneName in zones) {
                if (zones.hasOwnProperty(zoneName)) {
                    const zoneEl = document.querySelector(`[data-fred-dropzone="${zoneName}"]`);
                    if (zoneEl) {
                        zones[zoneName].forEach(html => {
                            const virtualWrapper = document.createElement('div');
                            virtualWrapper.innerHTML = html;
                            
                            let apiItem = virtualWrapper.querySelector('.fred-api');
                            while(apiItem) {
                                apiItem.replaceWith(Elements.wrapContent(apiItem));

                                apiItem = virtualWrapper.querySelector('.fred-api');
                            }
                            
                            zoneEl.append(virtualWrapper.firstChild); 
                        });
                    }
                }
            }

            drake.reloadContainers();
        });
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
