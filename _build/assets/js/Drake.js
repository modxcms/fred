import emitter from './EE';
import dragula from 'dragula';

class Drake {
    constructor() {
        this.drake = null;
    }

    initDrake() {
        const containers = [...document.querySelectorAll('[data-fred-dropzone]')];
        containers.unshift(document.querySelector('.source'));

        console.log('drake init');

        this.drake = dragula(containers, {
            copy: function (el, source) {
                return source === document.getElementsByClassName('source')[0]
            },
            accepts: function (el, target) {
                return target !== document.getElementsByClassName('source')[0]
            },
            moves: function (el, source, handle, sibling) {
                if ((source.dataset.fredDropzone !== undefined) && (source.dataset.fredDropzone !== '')) {
                    return handle.classList.contains('handle');
                }

                return true;
            }
        });

        this.drake.on('drop', (el, target, source, sibling) => {
            emitter.emit('fred-dragula-drop', el, target, source, sibling);
            this.reloadContainers();
        });

        this.drake.on('drag', (el, source) => {
            emitter.emit('fred-sidebar-hide');
        });

        this.drake.on('dragend', el => {
            emitter.emit('fred-sidebar-show');
        });

    };
    
    reloadContainers() {
        const initContainer = document.querySelectorAll('[data-fred-dropzone]:not([data-fred-dropzone=""])');
        const containers = [...initContainer];

        for (let i = 0; i < initContainer.length; i++) {
            containers.push(...(initContainer[i].querySelectorAll('[data-fred-dropzone]')));
        }

        containers.unshift(document.querySelector('.source'));

        this.drake.containers = containers;
    }
}

const drake = new Drake();

export default drake;