import emitter from './EE';
import dragula from 'dragula';
import ContentElement from './Components/Sidebar/Elements/ContentElement';

class Drake {
    constructor() {
        this.drake = null;

        this.topScroll = null;
        this.bottomScroll = null;
        this.scrollSpeed = null;
        this.lastPosition = null;

        this.scrollHandler = this.scrollHandler.bind(this);
    }

    initDrake() {
        const containers = [...document.querySelectorAll('[data-fred-dropzone]:not([data-fred-dropzone=""])')];
        containers.unshift(...(document.querySelectorAll('.source')));

        const contains = (a, b) => {
            return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_CONTAINED_BY);
        };

        try {
            this.drake = dragula(containers, {
                copy: function (el, source) {
                    return source.classList.contains('source');
                },
                accepts: function (el, target) {
                    if (!contains(el, target) === false) {
                        return false;
                    }

                    return !target.classList.contains('source');
                },
                moves: function (el, source, handle, sibling) {
                    if ((source.dataset.fredDropzone !== undefined) && (source.dataset.fredDropzone !== '')) {
                        return handle.classList.contains('handle');
                    }

                    return true;
                }
            });
        } catch (err) {
        }

        this.drake.on('cloned', (clone, original, type) => {
            if (type === 'copy') {
                clone.lastChild.elementOptions = original.lastChild.elementOptions;
            }
        });

        this.drake.on('drop', (el, target, source, sibling) => {
            //emitter.emit('fred-dragula-drop', el, target, source, sibling);

            if (source.classList.contains('blueprints-source') && el.parentNode) {
                const parent = target.fredEl || null;
                const contentElement = new ContentElement(el.lastChild, target.dataset.fredDropzone, parent);
                
                if (parent) {
                    if (sibling === null) {
                        parent.dzs[target.dataset.fredDropzone].children.push(contentElement.wrapper);
                    } else {
                        parent.dzs[target.dataset.fredDropzone].children.splice(parent.dzs[target.dataset.fredDropzone].children.indexOf(sibling), 0, contentElement.wrapper);
                    }
                }
                
                el.parentNode.replaceChild(contentElement.wrapper, el);
            } else {
                if (target && el.fredEl) {
                    if (el.fredEl.parent) {
                        el.fredEl.parent.dzs[source.dataset.fredDropzone].children.splice(el.fredEl.parent.dzs[source.dataset.fredDropzone].children.indexOf(el), 1);
                    }

                    const parent = target.fredEl || null;
                    if (parent) {
                        if (sibling === null) {
                            parent.dzs[target.dataset.fredDropzone].children.push(el);
                        } else {
                            parent.dzs[target.dataset.fredDropzone].children.splice(parent.dzs[target.dataset.fredDropzone].children.indexOf(sibling), 0, el);
                        }
                    }
                    el.fredEl.parent = parent;
                    el.fredEl.dzName = target.dataset.fredDropzone;
                }
            }

            this.reloadContainers();
        });

        this.drake.on('drag', (el, source) => {
            this.registerScroller();
            
            const dropZones = document.querySelectorAll('[data-fred-dropzone]');
            for (let zone of dropZones) {
                zone.classList.add('fred--dropzone_highlight');
            }

            emitter.emit('fred-sidebar-hide', true);
        });

        this.drake.on('dragend', el => {
            this.removeScroller();
            
            const dropZones = document.querySelectorAll('[data-fred-dropzone]');
            for (let zone of dropZones) {
                zone.classList.remove('fred--dropzone_highlight');
            }

            emitter.emit('fred-sidebar-show', true);
        });

    };
    
    cancelScroll(type) {
        if (this[type + 'Scroll']) {
            clearInterval(this[type + 'Scroll']);
            this[type + 'Scroll'] = null;
            this.scrollSpeed = null;
            this.lastPosition = null;
        }
    }
    
    scrollHandler(e) {
        const height = document.body.offsetHeight;

        if (e.y > (height - 30)) {
            let speed = 2;

            if (e.y > (height - 15)) {
                speed = 4;
            }

            if (this.topScroll && (speed !== this.scrollSpeed)) {
                clearInterval(this.topScroll);
                this.topScroll = null;
            }

            if (this.topScroll === null) {
                this.lastPosition = document.body.offsetHeight + document.body.scrollTop;

                this.topScroll = setInterval(() => {
                    this.scrollSpeed = speed;
                    document.body.scrollBy(0, speed);
                    const newPosition = document.body.offsetHeight + document.body.scrollTop;

                    if(this.lastPosition === newPosition) {
                        this.cancelScroll('top');
                    }

                    this.lastPosition = newPosition;
                }, 5);
            }
        } else {
            this.cancelScroll('top');
        }

        if (e.y < 30) {
            let speed = -2;

            if (e.y < 15) {
                speed = -4;
            }

            if (this.bottomScroll && (speed !== this.scrollSpeed)) {
                clearInterval(this.bottomScroll);
                this.bottomScroll = null;
            }

            if (this.bottomScroll === null) {
                this.lastPosition = document.body.offsetHeight + document.body.scrollTop;

                this.bottomScroll = setInterval(() => {
                    this.scrollSpeed = speed;
                    document.body.scrollBy(0, speed);
                    const newPosition = document.body.offsetHeight + document.body.scrollTop;

                    if(this.lastPosition === newPosition) {
                        this.cancelScroll('bottom');
                    }

                    this.lastPosition = newPosition;
                }, 5);
            }
        } else {
            this.cancelScroll('bottom');
        }
    }
    
    registerScroller() {
        this.topScroll = null;
        this.bottomScroll = null;
        this.scrollSpeed = null;
        this.lastPosition = null;

        document.addEventListener('mousemove', this.scrollHandler);
    }
    
    removeScroller() {
        document.removeEventListener('mousemove', this.scrollHandler);
    }

    reloadContainers() {
        const initContainer = document.querySelectorAll('[data-fred-dropzone]:not([data-fred-dropzone=""])');
        const containers = [...initContainer];

        for (let i = 0; i < initContainer.length; i++) {
            containers.push(...(initContainer[i].querySelectorAll('[data-fred-dropzone]:not([data-fred-dropzone=""])')));
        }

        containers.unshift(...(document.querySelectorAll('.source')));

        this.drake.containers = containers;
    }
}

const drake = new Drake();

export default drake;