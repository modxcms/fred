import emitter from './EE';
import dragula from 'dragula';
import ContentElement from './Components/Sidebar/Elements/ContentElement';
import fredConfig from "./Config";
import { buildBlueprint } from "./Utils";
import { loadBlueprint } from './Actions/blueprints';

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
                direction: 'horizontal',
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
                clone.lastChild.elementMarkup = original.lastChild.elementMarkup;
            }
        });

        this.drake.on('drop', (el, target, source, sibling) => {
            //emitter.emit('fred-dragula-drop', el, target, source, sibling);
            
            if (source.classList.contains('source') && el.parentNode) {
                const parent = target.fredEl || null;
                
                if (source.classList.contains('elements-source')) {
                    const contentElement = new ContentElement(el.lastChild, target.dataset.fredDropzone, parent);
                    contentElement.render().then(() => {
                        if (parent) {
                            if (sibling === null) {
                                parent.dzs[target.dataset.fredDropzone].children.push(contentElement.wrapper);
                            } else {
                                parent.dzs[target.dataset.fredDropzone].children.splice(parent.dzs[target.dataset.fredDropzone].children.indexOf(sibling), 0, contentElement.wrapper);
                            }
                        }

                        el.parentNode.replaceChild(contentElement.wrapper, el);

                        const event = new CustomEvent('FredElementDrop', {detail: {fredEl: contentElement}});
                        document.body.dispatchEvent(event);

                        const jsElements = contentElement.wrapper.querySelectorAll('[data-fred-on-drop]');
                        for (let jsEl of jsElements) {
                            if (window[jsEl.dataset.fredOnDrop]) {
                                window[jsEl.dataset.fredOnDrop](contentElement);
                            }
                        }

                        this.reloadContainers();
                    });
                }

                if (source.classList.contains('blueprints-source')) {
                    emitter.emit('fred-loading', fredConfig.lng('fred.fe.blueprints.building_content_from_blueprint'));

                    el.remove();
                    
                    loadBlueprint(el.lastChild.dataset.fredBlueprintId)
                        .then(json => {
                            buildBlueprint(json.data, parent, target, sibling).then(() => {
                                drake.reloadContainers();
                                emitter.emit('fred-loading-hide');
                            });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
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

                this.reloadContainers();
            }
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
    
    scrollWindow(e, type, breakpoints) {
        let start = false;
        let speed = null;
        
        breakpoints.forEach(breakpoint => {
            if (type === 'top') {
                const currentBreakpoint = e.y > (window.innerHeight - breakpoint.offset);
                start = start || currentBreakpoint;
                
                if (currentBreakpoint) {
                    speed = breakpoint.speed;
                }
            }  else {
                const currentBreakpoint = e.y < breakpoint.offset;
                start = start || currentBreakpoint;

                if (currentBreakpoint) {
                    speed = -1 * breakpoint.speed;
                }
            }
        });
        
        if (start) {
            if (this[type + 'Scroll'] && (speed !== this.scrollSpeed)) {
                clearInterval(this[type + 'Scroll']);
                this[type + 'Scroll'] = null;
            }

            if (this[type + 'Scroll'] === null) {
                this.lastPosition = window.innerHeight + window.scrollY;

                this[type + 'Scroll'] = setInterval(() => {
                    this.scrollSpeed = speed;
                    window.scrollBy(0, speed);
                    const newPosition = window.innerHeight + window.scrollY;

                    if(this.lastPosition === newPosition) {
                        this.cancelScroll(type);
                    }

                    this.lastPosition = newPosition;
                }, 5);
            }
        } else {
            this.cancelScroll(type);
        }
    }
    
    scrollHandler(e) {
        this.scrollWindow(e, 'top', [{offset: 60, speed: 2},{offset:30, speed: 8}]);
        this.scrollWindow(e, 'bottom', [{offset: 60, speed: 2},{offset:30, speed: 8}]);
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