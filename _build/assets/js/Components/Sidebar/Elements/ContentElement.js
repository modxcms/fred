import drake from '../../../Drake';
import emitter from '../../../EE';
import { twig } from 'twig';
import fetch from 'isomorphic-fetch';
import fredConfig from '../../../Config';
import Finder from "../../../Finder";
import { div, button } from '../../../UI/Elements';

export class ContentElement {
    constructor(el, dzName, parent = null, content = {}, settings = {}) {
        this.config = fredConfig.config;
        this.el = el;
        this.template = twig({data: this.el.innerHTML});
        this.id = parseInt(this.el.dataset.fredElementId);
        this.wrapper = null;

        this.setUpEditors();
        this.setUpEditors();

        this.render = this.render.bind(this);

        this.parent = parent;
        this.dzName = dzName;
        this.options = JSON.parse(JSON.stringify((this.el.elementOptions || {})));
        this.content = JSON.parse(JSON.stringify(content));
        this.settings = {};

        if (this.options.settings) {
            this.options.settings.forEach(setting => {
                if (setting.group && setting.settings) {
                    setting.settings.forEach(subSetting => {
                        this.settings[subSetting.name] = subSetting.value || '';    
                    });
                } else {
                    this.settings[setting.name] = setting.value || '';
                }
            });
        }

        this.settings = {
            ...(this.settings),
            ...JSON.parse(JSON.stringify(settings))
        };

        this.dzs = {};

        this.inEditor = false;
    }
    
    setUpEditors() {
        this.editors = fredConfig.editors;

        this.iconEditor = this.config.iconEditor || 'IconEditor';
        this.iconEditor = this.editors[this.iconEditor] || null;

        this.imageEditor = this.config.imageEditor || 'ImageEditor';
        this.imageEditor = this.editors[this.imageEditor] || null;
    }
    
    setEl(el) {
        if (el.innerHTML === undefined) {
            this.el.innerHTML = el;
        } else {
            this.el.innerHTML = el.innerHTML;
        }
        
        this.template = twig({data: this.el.innerHTML});
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
        const wrapper = div(['fred--block']);
        wrapper.fredEl = this;

        wrapper.addEventListener('mouseover', e => {
            e.stopPropagation();

            let firstSet = false;
            
            if (e.path) {
                e.path.forEach(el => {
                    if (el.classList && el.classList.contains('fred--block')) {
                        el.classList.add('fred--block-active');
    
                        if (firstSet === true) {
                            el.classList.add('fred--block-active_parent');
                        }
    
                        firstSet = true;
                    }
                });
            } else {
                let el = e.target.parentNode;
                while(el) {
                    if (el.classList && el.classList.contains('fred--block')) {
                        el.classList.add('fred--block-active');

                        if (firstSet === true) {
                            el.classList.add('fred--block-active_parent');
                        }

                        firstSet = true;
                    }
                    
                    el = el.parentNode;
                }
            }
        });

        wrapper.addEventListener('mouseout', e => {
            if (this.inEditor === false) {
                wrapper.classList.remove('fred--block-active');
                wrapper.classList.remove('fred--block-active_parent');
            }
        });

        const toolbar = div(['fred--toolbar', 'handle']);

        const moveHandle = div(['fred--toolbar-grip']);

        toolbar.appendChild(moveHandle);

        const duplicate = button('', ['fred--duplicate-icon'], this.duplicate.bind(this));
        const trashHandle = button('', ['fred--trash'], this.remove.bind(this));

        if (this.options.settings) {
            const settings = button('', ['fred--element-settings'], this.openSettings.bind(this));
            toolbar.appendChild(settings);
        }

        const positionGroup = div(['fred--position-group']);

        const moveUp = button('', ['fred--position-up']);
        moveUp.setAttribute('disabled', 'disabled');
        
        const moveDown = button('', ['fred--position-down']);
        moveDown.setAttribute('disabled', 'disabled');

        positionGroup.appendChild(moveUp);
        positionGroup.appendChild(moveDown);
        
        toolbar.appendChild(duplicate);
        toolbar.appendChild(trashHandle);
        toolbar.appendChild(positionGroup);

        wrapper.appendChild(toolbar);

        const content = div(['fred--block_content']);
        content.dataset.fredElementId = this.el.dataset.fredElementId;

        return this.templateRender().then(html => {
            content.innerHTML = html;
            this.initDropZones(wrapper, content);
            this.initElements(wrapper,content);

            wrapper.appendChild(content);
            
            if (this.wrapper !== null) {
                this.wrapper.replaceWith(wrapper);
            }
                
            this.wrapper = wrapper;
            
            return wrapper;
        });
    }
    
    initDropZones(wrapper, content) {
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
    }
    
    initElements(wrapper, content) {
        const fredElements = content.querySelectorAll('[data-fred-name]');
        for (let el of fredElements) {
            el.fredEl = this;
            
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if ((mutation.type === 'characterData') && !el.rte) {
                        if (!this.content[el.dataset.fredName]) this.content[el.dataset.fredName] = {};
                        if (!this.content[el.dataset.fredName]._raw) this.content[el.dataset.fredName]._raw = {};

                        this.content[el.dataset.fredName]._raw._value = el.innerHTML;

                        if (el.dataset.fredTarget) {
                            emitter.emit('fred-page-setting-change', el.dataset.fredTarget, this.content[el.dataset.fredName]._raw._value, el);
                        }

                        return;
                    }

                    if (mutation.type === 'attributes') {
                        if ((el.nodeName.toLowerCase()) === 'img' && (mutation.attributeName === 'src')) {
                            if (!this.content[el.dataset.fredName]) this.content[el.dataset.fredName] = {};
                            if (!this.content[el.dataset.fredName]._raw) this.content[el.dataset.fredName]._raw = {};

                            this.content[el.dataset.fredName]._raw._value = el.getAttribute(mutation.attributeName);

                            if (el.dataset.fredTarget) {
                                emitter.emit('fred-page-setting-change', el.dataset.fredTarget, this.content[el.dataset.fredName]._raw._value, el);
                            }

                            return;
                        }

                        if ((el.nodeName.toLowerCase()) === 'i' && (mutation.attributeName === 'class')) {
                            if (!this.content[el.dataset.fredName]) this.content[el.dataset.fredName] = {};
                            if (!this.content[el.dataset.fredName]._raw) this.content[el.dataset.fredName]._raw = {};

                            this.content[el.dataset.fredName]._raw._value = el.className;

                            if (el.dataset.fredTarget) {
                                emitter.emit('fred-page-setting-change', el.dataset.fredTarget, this.content[el.dataset.fredName]._raw._value, el);
                            }

                            return;
                        }

                        if (el.dataset.fredAttrs) {
                            const attrs = el.dataset.fredAttrs.split(',');
                            if (attrs.indexOf(mutation.attributeName) === -1) return;

                            if (!this.content[el.dataset.fredName]) this.content[el.dataset.fredName] = {};
                            if (!this.content[el.dataset.fredName]._raw) this.content[el.dataset.fredName]._raw = {};

                            this.content[el.dataset.fredName]._raw[mutation.attributeName] = el.getAttribute(mutation.attributeName);
                        }
                    }
                });
            });

            observer.observe(el, {
                attributes: true,
                characterData: true,
                subtree: true
            });

            if (el.dataset.fredRte === 'true') {
                // I hate this fix; tinemce throws an error on first drop from dragule
                setTimeout(() => {
                    tinymce.init({
                        target: el,
                        theme: 'inlite',
                        inline: true,
                        plugins: 'modxlink image imagetools',
                        insert_toolbar: "image quicktable modxlink",
                        selection_toolbar: 'bold italic | h2 h3 blockquote modxlink',
                        image_advtab: true,
                        imagetools_toolbar: 'alignleft aligncenter alignright | rotateleft rotateright | flipv fliph | editimage imageoptions',
                        auto_focus: false,
                        branding: false,
                        relative_urls: false,
                        file_picker_callback : (callback, value, meta) => {
                            const finder = new Finder((file, fm) => {
                                const url = file.url;
                                const info = file.name + ' (' + fm.formatSize(file.size) + ')';

                                if (meta.filetype == 'image') {
                                    callback(url, {alt: info});
                                    return;
                                }

                                callback(url);
                            }, 'Browse Files', Finder.getFinderOptionsFromElement(el, (meta.filetype === 'image')));

                            finder.render();
                            
                            return false;
                        },
                        setup: editor => {
                            el.rte = editor;

                            editor.on('change', e => {
                                if (!this.content[el.dataset.fredName]) this.content[el.dataset.fredName] = {};
                                if (!this.content[el.dataset.fredName]._raw) this.content[el.dataset.fredName]._raw = {};
    
                                this.content[el.dataset.fredName]._raw._value = editor.getContent();
    
                                if (el.dataset.fredTarget) {
                                    emitter.emit('fred-page-setting-change', el.dataset.fredTarget, this.content[el.dataset.fredName]._raw._value, el);
                                }
                            });
    
                            editor.on('focus', e => {
                                this.inEditor = true;
                            });
    
                            editor.on('blur', e => {
                                this.inEditor = false;
                                wrapper.classList.remove('fred--block-active');
                                wrapper.classList.remove('fred--block-active_parent');
                            });
                        }
                    });
                }, 1);
            }

            if (!this.content[el.dataset.fredName]) this.content[el.dataset.fredName] = {};
            if (!this.content[el.dataset.fredName]._raw) this.content[el.dataset.fredName]._raw = {};

            if (el.dataset.fredTarget) {
                if (fredConfig.pageSettings[el.dataset.fredTarget]) {
                    this.content[el.dataset.fredName]._raw._value = fredConfig.pageSettings[el.dataset.fredTarget];
                }
            }

            if (this.content[el.dataset.fredName]._raw._value) {
                switch (el.nodeName.toLowerCase()) {
                    case 'i':
                        el.className = this.content[el.dataset.fredName]._raw._value;

                        el.addEventListener('click', e => {
                            e.preventDefault();
                            if (this.iconEditor !== null) {
                                new this.iconEditor(el);
                            } else {
                                console.log(`Editor ${this.config.iconEditor} not found`);
                            }
                        });
                        break;
                    case 'img':
                        el.setAttribute('src', this.content[el.dataset.fredName]._raw._value);

                        el.addEventListener('click', e => {
                            e.preventDefault();
                            if (this.imageEditor !== null) {
                                new this.imageEditor(el);
                            } else {
                                console.log(`Editor ${this.config.imageEditor} not found`);
                            }
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
            } else {
                switch (el.nodeName.toLowerCase()) {
                    case 'i':
                        this.content[el.dataset.fredName]._raw._value = el.className;

                        el.addEventListener('click', e => {
                            e.preventDefault();
                            if (this.iconEditor !== null) {
                                new this.iconEditor(el);
                            } else {
                                console.log(`Editor ${this.config.iconEditor} not found`);
                            }
                        });
                        break;
                    case 'img':
                        this.content[el.dataset.fredName]._raw._value = el.getAttribute('src');

                        el.addEventListener('click', e => {
                            e.preventDefault();
                            if (this.imageEditor !== null) {
                                new this.imageEditor(el);
                            } else {
                                console.log(`Editor ${this.config.imageEditor} not found`);
                            }
                        });

                        break;
                    default:
                        this.content[el.dataset.fredName]._raw._value = el.innerHTML;
                }

                if (el.dataset.fredAttrs) {
                    const attrs = el.dataset.fredAttrs.split(',');
                    attrs.forEach(attr => {
                        if (this.content[el.dataset.fredName]._raw[attr]) {
                            this.content[el.dataset.fredName]._raw[attr] = el.getAttribute(attr);
                        }
                    });
                }
            }
        }
    }
    
    setElValue(el, value) {
        if (!this.content[el.dataset.fredName]) this.content[el.dataset.fredName] = {};
        if (!this.content[el.dataset.fredName]._raw) this.content[el.dataset.fredName]._raw = {};

        switch (el.nodeName.toLowerCase()) {
            case 'i':
                this.content[el.dataset.fredName]._raw._value = value;
                el.className = value;
                break;
            case 'img':
                this.content[el.dataset.fredName]._raw._value = value;
                el.setAttribute('src', value);
                break;
            default:
                this.content[el.dataset.fredName]._raw._value = value;
                el.innerHTML = value;
        }


    }

    templateRender(parseModx = true) {
        if (this.options.remote === true) {
            return this.remoteTemplateRender(parseModx);
        }
        
        return Promise.resolve(this.localTemplateRender());
    }
    
    localTemplateRender() {
        return this.template.render(this.settings);
    }
    
    remoteTemplateRender(parseModx = true) {
        return fetch(`${this.config.assetsUrl}endpoints/ajax.php?action=render-element`, {
            method: "post",
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                resource: this.config.resource.id,
                parseModx,
                element: this.id,
                settings: this.settings
            })
        }).then(response => {
            if (response.status > 299) {
                return response.json().then(data => {
                    throw new Error(data.message);    
                });
            }
            
            return response.json();
        }).then(json => {
            this.setEl(json.data.html);
            return json.data.html;
        })
        .catch(err => {
            console.log(err);
            emitter.emit('fred-loading', err.message);
            return '';
        });
    }
    
    cleanRender(parseModx = false, handleLinks = true) {
        const element = div();

        return this.templateRender(parseModx).then(html => {
            element.innerHTML = html;
            
            const noRenderElements = element.querySelectorAll('[data-fred-render="false"]');
            for (let noRenderElement of noRenderElements) {
                noRenderElement.remove();
            }

            const fredElements = element.querySelectorAll('[data-fred-name]');
            for (let el of fredElements) {
                if (this.content[el.dataset.fredName] && this.content[el.dataset.fredName]._raw && this.content[el.dataset.fredName]._raw._value) {
                    switch (el.nodeName.toLowerCase()) {
                        case 'i':
                            el.className = this.content[el.dataset.fredName]._raw._value;
                            break;
                        case 'img':
                            el.setAttribute('src', this.content[el.dataset.fredName]._raw._value);
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

                el.removeAttribute('contenteditable');
                el.removeAttribute('data-fred-name');
                el.removeAttribute('data-fred-rte');
                el.removeAttribute('data-fred-target');
                el.removeAttribute('data-fred-attrs');
                el.removeAttribute('data-fred-media-source');
                el.removeAttribute('data-fred-image-media-source');
            }
            
            if (handleLinks === true) {
                const fredLinks = element.querySelectorAll('[data-fred-link-type]');
                for (let fredLink of fredLinks) {
                    const linkType = fredLink.dataset.fredLinkType;
                    fredLink.removeAttribute('data-fred-link-type');

                    if (linkType === 'page') {
                        const resourceId = parseInt(fredLink.dataset.fredLinkPage);
                        const anchor = fredLink.dataset.fredLinkAnchor ? ('#' + fredLink.dataset.fredLinkAnchor) : '';

                        if (resourceId > 0) {
                            fredLink.setAttribute('href', `[[~${resourceId}]]${anchor}`);
                        } else {
                            fredLink.setAttribute('href', anchor);
                        }

                        fredLink.removeAttribute('data-fred-link-page');
                        fredLink.removeAttribute('data-fred-link-anchor');
                    }
                }
            }

            const dzPromises = [];
            
            for (let dzName in this.dzs) {
                if (this.dzs.hasOwnProperty(dzName)) {
                    const dzEl = element.querySelector('[data-fred-dropzone="' + dzName + '"]');
                    if (dzEl) {
                        dzEl.removeAttribute('data-fred-dropzone');

                        if (this.dzs[dzName].children.length > 0) {

                            let cleanedDropZoneContent = '';
                            const childPromises = [];
                            
                            this.dzs[dzName].children.forEach(child => {
                                childPromises.push(child.fredEl.cleanRender(parseModx, handleLinks));
                            });

                            dzPromises.push(Promise.all(childPromises).then(values => {
                                values.forEach(childEl => {
                                    cleanedDropZoneContent += childEl.innerHTML;
                                });

                                dzEl.innerHTML = cleanedDropZoneContent;
                            }));
                        }
                    }
                }
            }

            return Promise.all(dzPromises).then(() => {
                return element;
            });
        });
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
                        clonedChild.render().then(() => {
                            this.addElementToDropZone(dzName, clonedChild);
    
                            clonedChild.duplicateDropZones(child.fredEl.dzs);
                        });
                    }
                });
            }
        }
    }

    duplicate() {
        const clone = new ContentElement(this.el, this.dzName, this.parent, this.content, this.settings);
        clone.render().then(() => {
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
        });
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