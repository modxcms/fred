import emitter from './EE';
import Sidebar from './Sidebar';
import Launcher from './Launcher';
import fetch from 'isomorphic-fetch';
import drake from './Drake';
import ContentElement from './Components/Sidebar/Elements/ContentElement';
import ElementSettings from './Components/Sidebar/Elements/ElementSettings';
import registerTineMCEPlugins from './TinyMCE/RegisterPlugins';
import editorsManager from './EditorsManager';
import libs from './libs';
import Editor from './Editors/Editor';

export default class Fred {
    constructor(config = {}) {
        this.config = config || {};
        this.loading = null;
        this.wrapper = null;
        this.config.pageSettings = {};
        this.libs = libs;

        document.addEventListener("DOMContentLoaded", () => {
            this.init();
        });
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('fred');
        
        this.testPreview();
        
        this.config.fredWrapper = this.wrapper;

        document.body.appendChild(this.wrapper);
    }
    
    testPreview() {
        const previewWrapper = document.createElement('div');
        previewWrapper.classList.add('fred--content-preview');
        previewWrapper.style.display = 'none';

        this.iframe = document.createElement('iframe');
        this.iframe.src = this.config.resource.previewUrl;
        this.iframe.style.width = '1024px';
        this.iframe.style.height = '768px';

        this.controls = document.createElement('div');
        this.controls.classList.add('fred--content-preview_controls');

        this.devices = document.createElement('div');
        this.devices.classList.add('fred--devices');
        
        this.tabletP = document.createElement('a');
        this.tabletP.classList.add('fred--tablet-portrait');
        this.tabletP.innerHTML = '<span>Tablet Portrait</span>';
        this.tabletP.addEventListener('click', e => {
            e.preventDefault();
            this.iframe.style.width = '768px';
            this.iframe.style.height = '1024px';
        });

        this.devices.appendChild(this.tabletP);

        this.tabletL = document.createElement('a');
        this.tabletL.classList.add('fred--tablet-landscape');
        this.tabletL.innerHTML = '<span>Tablet Landscape</span>';
        this.tabletL.addEventListener('click', e => {
            e.preventDefault();
            this.iframe.style.width = '1024px';
            this.iframe.style.height = '768px';
        });

        this.devices.appendChild(this.tabletL);

        this.phoneP = document.createElement('a');
        this.phoneP.classList.add('fred--smartphone-portrait');
        this.phoneP.innerHTML = '<span>Phone Portrait</span>';
        this.phoneP.addEventListener('click', e => {
            e.preventDefault();
            this.iframe.style.width = '320px';
            this.iframe.style.height = '480px';
        });

        this.devices.appendChild(this.phoneP);

        this.phoneL = document.createElement('a');
        this.phoneL.classList.add('fred--smartphone-landscape');
        this.phoneL.innerHTML = '<span>Phone Landscape</span>';
        this.phoneL.addEventListener('click', e => {
            e.preventDefault();
            this.iframe.style.width = '480px';
            this.iframe.style.height = '320px';
        });

        this.devices.appendChild(this.phoneL);

        this.auto = document.createElement('a');
        this.auto.classList.add('fred--auto');
        this.auto.innerHTML = '<span>Auto</span>';
        this.auto.addEventListener('click', e => {
            e.preventDefault();
            this.iframe.style.width = '100%';
            this.iframe.style.height = '100%';
        });

        this.devices.appendChild(this.auto);

        this.controls.appendChild(this.devices);
        

        previewWrapper.append(this.controls);

        previewWrapper.appendChild(this.iframe);

        this.wrapper.appendChild(previewWrapper);
    }
    
    previewContent() {
        const promises = [];

        for (let i = 0; i < this.dropzones.length; i++) {
            promises.push(this.getCleanDropZoneContent(this.dropzones[i], true).then(content => {
                const dz = this.iframe.contentDocument.querySelector('[data-fred-dropzone="' + this.dropzones[i].dataset.fredDropzone + '"]');
                if (dz) {
                    dz.innerHTML = content;
                }
            }));
        }
        
        Promise.all(promises).then(() => {
            this.iframe.parentNode.style.display = 'block';
        });
    }
    
    renderComponents() {
        new Launcher((this.config.launcherPosition || 'bottom_left'));
        new Sidebar(this.config, this.wrapper);
        new ElementSettings();        
    }

    getDataFromDropZone(dropZone) {
        const data = [];

        for (let child of dropZone.children) {
            data.push(child.fredEl.getContent());
        }

        return data;
    }

    getCleanDropZoneContent(dropZone, parseModx = false) {
        let cleanedContent = '';

        const promises = [];
        for (let child of dropZone.children) {
            promises.push(child.fredEl.cleanRender(parseModx));
        }
        
        return Promise.all(promises).then(values => {
            values.forEach(el => {
                cleanedContent += el.innerHTML;
            });
            
            return cleanedContent;
        });
    }

    save() {
        emitter.emit('fred-loading', 'Saving Page');
        const body = {};
        const data = {};

        const promises = [];
        
        for (let i = 0; i < this.dropzones.length; i++) {
            data[this.dropzones[i].dataset.fredDropzone] = this.getDataFromDropZone(this.dropzones[i]);

            const targets = this.dropzones[i].querySelectorAll('[data-fred-target]:not([data-fred-target=""])');
            for (let target of targets) {
                if (!this.config.pageSettings.hasOwnProperty(target.dataset.fredTarget)) {
                    body[target.dataset.fredTarget] = target.innerHTML;
                }
            }
            promises.push(this.getCleanDropZoneContent(this.dropzones[i]).then(content => {
                body[this.dropzones[i].dataset.fredDropzone] = content;    
            }))
        }

        body.id = this.config.resource.id;
        body.data = data;
        body.pageSettings = this.config.pageSettings;

        Promise.all(promises).then(() => {
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
            const dzPromises = [];
            
            for (let zoneName in zones) {
                if (zones.hasOwnProperty(zoneName)) {
                    const zoneEl = document.querySelector(`[data-fred-dropzone="${zoneName}"]`);
                    if (zoneEl) {
                        const promises = [];

                        zoneEl.innerHTML = '';
                        zones[zoneName].forEach(element => {
                            const chunk = document.createElement('div');
                            chunk.classList.add('chunk');
                            chunk.setAttribute('hidden', 'hidden');
                            chunk.dataset.fredElementId = element.widget;
                            chunk.innerHTML = json.data.elements[element.widget].html;
                            chunk.elementOptions = json.data.elements[element.widget].options;

                            const contentElement = new ContentElement(this.config, chunk, zoneName, null, element.values, (element.settings || {}));
                            promises.push(contentElement.render().then(wrapper => {
                                this.loadChildren(element.children, contentElement, json.data.elements);
                                return wrapper;
                            }));

                        });

                        dzPromises.push(Promise.all(promises).then(wrappers => {
                            wrappers.forEach(wrapper => {
                                zoneEl.appendChild(wrapper);
                            });
                        }));
                    }
                }
            }

            Promise.all(dzPromises).then(() => {
                drake.reloadContainers();
    
                emitter.emit('fred-loading-hide');
            });
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
                    contentElement.render().then(() => {
                        parent.addElementToDropZone(zoneName, contentElement);
    
                        this.loadChildren(element.children, contentElement, elements);
                    });
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

        emitter.on('fred-page-setting-change', (settingName, settingValue, sourceEl) => {
            this.dropzones.forEach(dz => {
                const targets = dz.querySelectorAll(`[data-fred-target="${settingName}"`);
                for (let target of targets) {
                    if (target !== sourceEl) {
                        target.fredEl.setElValue(target, settingValue);
                    }
                }
            });
        });

        emitter.on('fred-preview-on', () => {
            this.previewContent();
        });
        
        emitter.on('fred-preview-off', () => {
            this.iframe.parentNode.style.display = 'none';
        });
    }
    
    registerEditor(name, initFn) {
        if (typeof initFn !== 'function') {
            console.log('initFn as to be a functions');
            return false;
        }
        
        const editor = initFn(Editor, this);
        
        return editorsManager.registerEditor(name, editor);
    }

    init() {
        console.log('Hello from Fred!');

        registerTineMCEPlugins(this);
        
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
        
        if (typeof this.config.beforeRender === 'function') {
            this.config.beforeRender = this.config.beforeRender.bind(this);
            this.config.beforeRender();
        }

        this.render();
        drake.initDrake(this.config);

        this.loadContent().then(() => {
            this.renderComponents();
        });

    }
}
