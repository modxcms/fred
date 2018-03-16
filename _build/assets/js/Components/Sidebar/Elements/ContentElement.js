import drake from '../../../drake';
import imageEditor from '../../../Editors/ImageEditor';
import emitter from '../../../EE';
import doT from 'dot';

export class ContentElement {
    constructor(el, dzName, parent = null, content = {}, settings = {}) {
        this.el = el;
        this.template = doT.template(this.el.innerHTML);
        this.id = parseInt(this.el.dataset.fredElementId);

        this.parent = parent;
        this.dzName = dzName;
        this.options = {...(this.el.elementOptions || {})};
        this.content = {...content};
        this.settings = {};

        if (this.options.settings) {
            this.options.settings.forEach(setting => {
                this.settings[setting.name] = setting.value || '';
            });
        }

        this.settings = {
            ...(this.settings),
            ...settings
        };

        this.dzs = {};

        this.wrapper = this.render();
    }

    getContent() {
        const content = {
            widget: this.id,
            values: this.content,
            settings: this.settings,
            children: {}
        };

        for (let dzName in this.dzs) {
            if (this.dzs.hasOwnProperty(dzName)) {
                if (this.dzs[dzName].children.length > 0) {
                    content.children[dzName] = [];

                    this.dzs[dzName].children.forEach(child => {
                        content.children[dzName].push(child.fredEl.getContent());
                    });
                }
            }
        }

        return content;
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('fred--block');
        wrapper.fredEl = this;

        wrapper.addEventListener('mouseover', e => {
            e.stopPropagation();

            let firstSet = false;
            e.path.forEach(el => {
                if (el.classList && el.classList.contains('fred--block')) {
                    el.classList.add('fred--block-active');

                    if (firstSet === true) {
                        el.classList.add('fred--block-active_parent');
                    }

                    firstSet = true;
                }
            });
        });

        wrapper.addEventListener('mouseout', e => {
            wrapper.classList.remove('fred--block-active');
            wrapper.classList.remove('fred--block-active_parent');
        });

        const toolbar = document.createElement('div');
        toolbar.classList.add('fred--toolbar', 'handle');

        const moveHandle = document.createElement('div');
        moveHandle.classList.add('fred--toolbar-grip');

        toolbar.appendChild(moveHandle);

        const duplicate = document.createElement('button');
        duplicate.classList.add('fred--duplicate-icon');
        duplicate.addEventListener('click', e => {
            e.preventDefault();
            this.duplicate();
        });

        const trashHandle = document.createElement('button');
        trashHandle.classList.add('fred--trash');
        trashHandle.addEventListener('click', e => {
            e.preventDefault();
            this.remove();
        });

        if (this.options.settings) {
            const settings = document.createElement('button');
            settings.classList.add('fred--element-settings');
            settings.addEventListener('click', e => {
                e.preventDefault();
                this.openSettings();
            });

            toolbar.appendChild(settings);
        }

        
        toolbar.appendChild(duplicate);
        toolbar.appendChild(trashHandle);

        wrapper.appendChild(toolbar);

        const content = document.createElement('div');
        content.classList.add('fred--block_content');
        content.dataset.fredElementId = this.el.dataset.fredElementId;

        content.innerHTML = this.template(this.settings);

        const dzs = content.querySelectorAll('[data-fred-dropzone]');

        let prev = null;

        for (let dz of dzs) {
            if (prev === null) {
                prev = dz;
                dz.fredEl = this;
                if (!this.dzs[dz.dataset.fredDropzone]) {
                    this.dzs[dz.dataset.fredDropzone] = {
                        el: dz,
                        children: []
                    };
                } else {
                    this.dzs[dz.dataset.fredDropzone].el = dz;
                    this.dzs[dz.dataset.fredDropzone].children.forEach(child => {
                        this.dzs[dz.dataset.fredDropzone].el.appendChild(child);
                    });
                }
            } else {
                if (!prev.contains(dz)) {
                    dz.fredEl = this;
                    prev = dz;
                    if (!this.dzs[dz.dataset.fredDropzone]) {
                        this.dzs[dz.dataset.fredDropzone] = {
                            el: dz,
                            children: []
                        };
                    } else {
                        this.dzs[dz.dataset.fredDropzone].el = dz;
                        this.dzs[dz.dataset.fredDropzone].children.forEach(child => {
                            this.dzs[dz.dataset.fredDropzone].el.appendChild(child);
                        });
                    }
                }
            }
        }

        content.querySelectorAll('[contenteditable="true"]').forEach(el => {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'characterData') {
                        if (!this.content[el.dataset.fredName]) this.content[el.dataset.fredName] = {};
                        if (!this.content[el.dataset.fredName]._raw) this.content[el.dataset.fredName]._raw = {};
                        
                        this.content[el.dataset.fredName]._raw._value = el.innerHTML;
                        
                        return;
                    }

                    if (mutation.type === 'attributes') {
                        if ((el.nodeName.toLowerCase()) === 'img' && (mutation.attributeName === 'src')) {
                            if (!this.content[el.dataset.fredName]) this.content[el.dataset.fredName] = {};
                            if (!this.content[el.dataset.fredName]._raw) this.content[el.dataset.fredName]._raw = {};

                            this.content[el.dataset.fredName]._raw._value = el.getAttribute(mutation.attributeName);
                            
                            return;
                        }

                        if (!this.content[el.dataset.fredName]) this.content[el.dataset.fredName] = {};
                        if (!this.content[el.dataset.fredName]._raw) this.content[el.dataset.fredName]._raw = {};

                        this.content[el.dataset.fredName]._raw[mutation.attributeName] = el.getAttribute(mutation.attributeName);
                    }
                });
            });

            observer.observe(el, {
                attributes: true,
                characterData: true,
                subtree: true
            });

            if (this.content[el.dataset.fredName]) {
                switch (el.nodeName.toLowerCase()) {
                    case 'img':
                        el.setAttribute('src', this.content[el.dataset.fredName]._raw._value);
                        
                        el.addEventListener('click', e => {
                            e.preventDefault();
                            imageEditor.edit(el);
                        });
                        
                        break;
                    default:
                        el.innerHTML = this.content[el.dataset.fredName]._raw._value;
                }
                
                if (el.dataset.fredAttrs) {
                    const attrs = el.dataset.fredAttrs.split(',');
                    attrs.forEach(attr => {
                        if (this.content[el.dataset.fredName]._raw[attr]) {
                            el.setAttribute(attr, this.content[el.dataset.fredName]._raw[attr]);
                        }
                    });
                }
            }
        });

        wrapper.appendChild(content);

        return wrapper;
    }

    reRender() {
        const newWrapper = this.render();

        this.wrapper.replaceWith(newWrapper);
        this.wrapper = newWrapper;
    }

    remove() {
        if (this.parent) {
            const index = this.parent.dzs[this.dzName].children.indexOf(this.wrapper);
            if (index > -1) {
                this.parent.dzs[this.dzName].children.splice(index, 1);
            }
        }

        this.wrapper.remove();
    }

    duplicateDropZones(dzs) {
        for (let dzName in dzs) {
            if (dzs.hasOwnProperty(dzName)) {
                dzs[dzName].children.forEach(child => {
                    if (this.dzs[dzName]) {
                        const clonedChild = new ContentElement(child.fredEl.el, dzName, this, child.fredEl.content, child.fredEl.settings);
                        this.addElementToDropZone(dzName, clonedChild);

                        clonedChild.duplicateDropZones(child.fredEl.dzs);
                    }
                });
            }
        }
    }

    duplicate() {
        const clone = new ContentElement(this.el, this.dzName, this.parent, this.content, this.settings);
        clone.duplicateDropZones(this.dzs);

        if (this.wrapper.nextSibling === null) {
            this.wrapper.parentNode.appendChild(clone.wrapper);
        } else {
            this.wrapper.parentNode.insertBefore(clone.wrapper, this.wrapper.nextSibling);
        }

        if (this.parent) {
            const index = this.parent.dzs[this.dzName].children.indexOf(this.wrapper);
            if (index > -1) {
                this.parent.dzs[this.dzName].children.splice(index + 1, 0, clone.wrapper);
            }
        }

        drake.reloadContainers();

        return true;
    }

    openSettings() {
        emitter.emit('fred-element-settings-open', this);
    }

    addElementToDropZone(zoneName, element) {
        if (!this.dzs[zoneName]) return false;

        this.dzs[zoneName].children.push(element.wrapper);
        this.dzs[zoneName].el.appendChild(element.wrapper);

        return true;
    }
}

export default ContentElement;