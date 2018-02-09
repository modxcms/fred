import emitter from './EE';
import dragula from 'dragula';

class Drake {
    constructor() {
        this.drake = null;
    }

    initDrake() {
        const containers = [...document.querySelectorAll('[data-fred-dropzone]:not([data-fred-dropzone=""])')];
        containers.unshift(document.querySelector('.source'));


        const contains = (a, b) => {
            return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_CONTAINED_BY);
        };
        
        try {
            this.drake = dragula(containers, {
                copy: function (el, source) {
                    return source === document.getElementsByClassName('source')[0]
                },
                accepts: function (el, target) {
                    if (!contains(el, target) === false) {
                        return false;
                    }
                    
                    return target !== document.getElementsByClassName('source')[0]
                },
                moves: function (el, source, handle, sibling) {
                    if ((source.dataset.fredDropzone !== undefined) && (source.dataset.fredDropzone !== '')) {
                        return handle.classList.contains('handle');
                    }
    
                    return true;
                }
            });
        } catch (err){}
        
        this.drake.on('drop', (el, target, source, sibling) => {
            emitter.emit('fred-dragula-drop', el, target, source, sibling);
            this.reloadContainers();
        });

        this.drake.on('drag', (el, source) => {
            const dropZones = document.querySelectorAll('[data-fred-dropzone');
            for (let zone of dropZones) {
                zone.classList.add('fred--dropzone_highlight');
            }
            
            emitter.emit('fred-sidebar-hide');
        });

        this.drake.on('dragend', el => {
            const dropZones = document.querySelectorAll('[data-fred-dropzone');
            for (let zone of dropZones) {
                zone.classList.remove('fred--dropzone_highlight');
            }
            
            emitter.emit('fred-sidebar-show');
        });

    };
    
    reloadContainers() {
        const initContainer = document.querySelectorAll('[data-fred-dropzone]:not([data-fred-dropzone=""])');
        const containers = [...initContainer];

        for (let i = 0; i < initContainer.length; i++) {
            containers.push(...(initContainer[i].querySelectorAll('[data-fred-dropzone]:not([data-fred-dropzone=""])')));
        }

        containers.unshift(document.querySelector('.source'));

        this.drake.containers = containers;
    }
}

const drake = new Drake();

export default drake;