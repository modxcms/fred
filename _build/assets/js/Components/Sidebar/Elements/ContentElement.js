import drake from '../../../Drake';
import emitter from '../../../EE';
import { twig } from 'twig';
import fetch from 'isomorphic-fetch';
import fredConfig from '../../../Config';
import { div, button } from '../../../UI/Elements';

export class ContentElement {
    constructor(el, dzName, parent = null, content = {}, settings = {}) {
        this.config = fredConfig.config;
        this.el = el;
        this.template = twig({data: this.el.elementMarkup});
        this.id = parseInt(this.el.dataset.fredElementId);
        this.title = this.el.dataset.fredElementTitle;
        this.wrapper = null;

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
        if (el.elementMarkup === undefined) {
            this.el.elementMarkup = el;
        } else {
            this.el.elementMarkup = el.elementMarkup;
        }
        
        this.template = twig({data: this.el.elementMarkup});
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

    setWrapperActiveState(wrapper) {
        wrapper.addEventListener('mouseover', e => {
            e.stopPropagation();

            let firstSet = false;

            if (e.path) {
                e.path.forEach(el => {
                    if (el.classList && el.classList.contains('fred--block')) {
                        el.classList.add('fred--block-active');

                        if (this.atTop(el)) {
                            el.classList.add('fred--block-active_top');
                        }

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

                        if (this.atTop(el)) {
                            el.classList.add('fred--block-active_top');
                        }

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
                wrapper.classList.remove('fred--block-active_top');
                wrapper.classList.remove('fred--block-active_parent');
            }
        });
    }

    atTop(element) {
        this.toTop = 0;

        while(element) {
            this.toTop += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }

        return (this.toTop  < 38);
    }
    
    render() {
        const wrapper = div(['fred--block']);
        wrapper.fredEl = this;

        this.setWrapperActiveState(wrapper);

        const toolbar = div(['fred--toolbar', 'handle']);
        const moveHandle = div(['fred--toolbar-grip', 'handle']);
        const duplicate = button('', 'fred.fe.content.duplicate', ['fred--duplicate-icon'], this.duplicate.bind(this));
        const trashHandle = button('', 'fred.fe.content.delete', ['fred--trash'], this.remove.bind(this));
        
        toolbar.appendChild(moveHandle);

        if (this.options.settings) {
            const settings = button('', 'fred.fe.content.settings', ['fred--element-settings'], this.openSettings.bind(this));
            toolbar.appendChild(settings);
        }

        const positionGroup = div(['fred--position-group']);

        const moveUpRoot = () => {
            this.wrapper.parentElement.insertBefore(this.wrapper, this.wrapper.previousElementSibling);
        };

        const moveUpToDropzone = (target, dzName) => {
            target.addElementToDropZone(dzName, this);
        };

        const moveUpFromDropzone = () => {
            if (!this.parent.parent) {
                    this.dzName = this.parent.wrapper.parentElement.dataset.fredDropzone;
                    this.parent.wrapper.parentElement.insertBefore(this.wrapper, this.parent.wrapper);
                    this.parent = null;
            } else {
                const parentPosition = this.parent.parent.dzs[this.parent.dzName].children.indexOf(this.parent.wrapper);
                if (parentPosition !== -1) {
                    if (0 === parentPosition) {
                        this.parent.parent.unshiftElementToDropZone(this.parent.dzName, this);
                    } else {
                        this.parent.parent.insertBeforeElementToDropZone(this.parent.dzName, this.parent, this);
                    }
                }
            }
        };

        const moveUpInDropzone = (fredEl, index) => {
            fredEl.parent.dzs[fredEl.dzName].children[index - 1].insertAdjacentElement('beforebegin', fredEl.wrapper);
            fredEl.parent.dzs[fredEl.dzName].children[index - 1] = fredEl.parent.dzs[fredEl.dzName].children.splice(index, 1, fredEl.parent.dzs[fredEl.dzName].children[index - 1])[0];
        };
        
        const moveUp = button('', 'fred.fe.content.move_up', ['fred--position-up'], () => {
            if (!this.parent) {
                if (this.wrapper.previousElementSibling) {
                    const dzList = Object.keys(this.wrapper.previousElementSibling.fredEl.dzs);
                    if (dzList.length > 0) {
                        moveUpToDropzone(this.wrapper.previousElementSibling.fredEl, dzList[dzList.length - 1]);
                    } else {
                        moveUpRoot();
                    }
                }
            } else {
                let carry = false;
                const dropZones = Object.keys(this.parent.dzs);
                for (let i = dropZones.length; i--; ) {
                    const dzName = dropZones[i];

                    if (carry === true) {
                        carry = false;
                        moveUpToDropzone(this.parent, dzName);
                        break;
                    }

                    if (dzName !== this.dzName) continue;

                    const index = this.parent.dzs[dzName].children.indexOf(this.wrapper);
                    if (index !== -1) {
                        const prevChild = this.parent.dzs[dzName].children[index - 1];
                        if (prevChild) {
                            const dzList = Object.keys(prevChild.fredEl.dzs);
                            if (dzList.length > 0) {
                                this.parent.dzs[dzName].children.splice(index, 1);
                                moveUpToDropzone(prevChild.fredEl, dzList[dzList.length - 1]);
                            } else {
                                moveUpInDropzone(this, index);
                            }
                        } else {
                            this.parent.dzs[dzName].children.shift();
                            carry = true;
                        }
                    }
                }

                if (carry === true) {
                    moveUpFromDropzone();
                }
            }
        });
        
        const moveDownRoot = () => {
            this.wrapper.parentElement.insertBefore(this.wrapper.nextElementSibling, this.wrapper);
        };
        
        const moveDownToDropzone = (target, dzName) => {
            target.unshiftElementToDropZone(dzName, this);
        };
        
        const moveDownInDropzone = (fredEl, index) => {
            fredEl.parent.dzs[fredEl.dzName].children[index + 1].insertAdjacentElement('afterend', fredEl.wrapper);
            fredEl.parent.dzs[fredEl.dzName].children[index] = fredEl.parent.dzs[fredEl.dzName].children.splice((index + 1), 1, fredEl.parent.dzs[fredEl.dzName].children[index])[0];
        };
        
        const moveDownFromDropzone = () => {
            if (!this.parent.parent) {
                if (!this.parent.wrapper.nextElementSibling) {
                    this.dzName = this.parent.wrapper.parentElement.dataset.fredDropzone;
                    this.parent.wrapper.parentElement.appendChild(this.wrapper);
                    this.parent = null;
                } else {
                    this.dzName = this.parent.wrapper.parentElement.dataset.fredDropzone;
                    this.parent.wrapper.parentElement.insertBefore(this.wrapper, this.parent.wrapper.nextElementSibling);
                    this.parent = null;
                }
            } else {
                const parentPosition = this.parent.parent.dzs[this.parent.dzName].children.indexOf(this.parent.wrapper);
                if (parentPosition !== -1) {
                    if ((this.parent.parent.dzs[this.parent.dzName].children.length - 1) === parentPosition) {
                        this.parent.parent.addElementToDropZone(this.parent.dzName, this);
                    } else {
                        this.parent.parent.insertBeforeElementToDropZone(this.parent.dzName, this.parent.parent.dzs[this.parent.dzName].children[parentPosition + 1].fredEl, this);
                    }
                }
            }
        };
        
        const moveDown = button('', 'fred.fe.content.move_down', ['fred--position-down'], () => {
            if (!this.parent) {
                if (this.wrapper.nextElementSibling) {
                    const dzList = Object.keys(this.wrapper.nextElementSibling.fredEl.dzs);
                    if (dzList.length > 0) {
                        moveDownToDropzone(this.wrapper.nextElementSibling.fredEl, dzList[0]);
                    } else {
                        moveDownRoot();
                    }
                }
            } else {
                let carry = false;
                
                for (let dzName in this.parent.dzs) {
                    if (this.parent.dzs.hasOwnProperty(dzName)) {
                        if (carry === true) {
                            carry = false;
                            moveDownToDropzone(this.parent, dzName);
                            break;
                        }
                        
                        if (dzName !== this.dzName) continue;

                        const index = this.parent.dzs[dzName].children.indexOf(this.wrapper);
                        if (index !== -1) {
                            const nextChild = this.parent.dzs[dzName].children[index + 1];
                            if (nextChild) {
                                const dzList = Object.keys(nextChild.fredEl.dzs);
                                if (dzList.length > 0) {
                                    this.parent.dzs[dzName].children.splice(index, 1);
                                    moveDownToDropzone(nextChild.fredEl, dzList[0]);
                                } else {
                                    moveDownInDropzone(this, index);
                                }
                            } else {
                                this.parent.dzs[dzName].children.pop();
                                carry = true;
                            }
                        }
                    }
                }
                
                if (carry === true) {
                    moveDownFromDropzone();
                }
            }
        });

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

    onRTEInitFactory (el) {
        return () => {
            el.rteInited = true;
        }
    }
    
    onRTEContentChangeFactory (el) {
        return (content) => {
            this.setContentValue(el, content);
        }
    }
    
    onRTEFocusFactory (wrapper, el) {
        return () => {
            this.inEditor = true;
        }
    }
    
    onRTEBlurFactory (wrapper, el) {
        return () => {
            this.inEditor = false;
            wrapper.classList.remove('fred--block-active');
            wrapper.classList.remove('fred--block-active_top');
            wrapper.classList.remove('fred--block-active_parent');
        }
    }
    
    setContentValue(el, content) {
        if (!this.content[el.dataset.fredName]) this.content[el.dataset.fredName] = {};
        if (!this.content[el.dataset.fredName]._raw) this.content[el.dataset.fredName]._raw = {};

        this.content[el.dataset.fredName]._raw._value = content;

        if (el.dataset.fredTarget) {
            emitter.emit('fred-page-setting-change', el.dataset.fredTarget, this.content[el.dataset.fredName]._raw._value, el);
        }
    }
    
    setContentElValue(el, onlyElValue = false, addListeners = true) {
        switch (el.nodeName.toLowerCase()) {
            case 'i':
                if (this.content[el.dataset.fredName]._raw._value !== undefined) {
                    el.className = this.content[el.dataset.fredName]._raw._value;
                } else {
                    if (onlyElValue) {
                        this.content[el.dataset.fredName]._raw._value = el.className;
                    }
                }

                if (addListeners) {
                    el.addEventListener('click', e => {
                        e.preventDefault();
                        if (this.iconEditor !== null) {
                            new this.iconEditor(el);
                        } else {
                            console.log(`Editor ${this.config.iconEditor} not found`);
                        }
                    });
                }
                
                break;
            case 'img':
                if (this.content[el.dataset.fredName]._raw._value !== undefined) {
                    el.setAttribute('src', this.content[el.dataset.fredName]._raw._value);
                } else {
                    if (onlyElValue) {
                        this.content[el.dataset.fredName]._raw._value = el.getAttribute('src');
                    }
                }

                if (addListeners) {
                    el.addEventListener('click', e => {
                        e.preventDefault();
                        if (this.imageEditor !== null) {
                            new this.imageEditor(el);
                        } else {
                            console.log(`Editor ${this.config.imageEditor} not found`);
                        }
                    });
                }

                break;
            default:
                if (this.content[el.dataset.fredName]._raw._value !== undefined) {
                    el.innerHTML = this.content[el.dataset.fredName]._raw._value;
                } else {
                    if (onlyElValue) {
                        this.content[el.dataset.fredName]._raw._value = el.innerHTML;
                    }
                }
        }

        if (el.dataset.fredAttrs) {
            const attrs = el.dataset.fredAttrs.split(',');
            attrs.forEach(attr => {
                if (this.content[el.dataset.fredName]._raw[attr] !== undefined) {
                    el.setAttribute(attr, this.content[el.dataset.fredName]._raw[attr]);
                } else {
                    if (onlyElValue) {
                        this.content[el.dataset.fredName]._raw[attr] = el.getAttribute(attr);
                    }
                }
            });
        }
    }
    
    initElements(wrapper, content) {
        const fredElements = content.querySelectorAll('[data-fred-name]');
        for (let el of fredElements) {
            el.fredEl = this;
            
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if ((mutation.type === 'characterData') && (!el.dataset.fredRte || el.dataset.fredRte === 'false' || !el.rteInited)) {
                        this.setContentValue(el, el.innerHTML);
                        return;
                    }

                    if (mutation.type === 'attributes') {
                        if ((el.nodeName.toLowerCase()) === 'img' && (mutation.attributeName === 'src')) {
                            this.setContentValue(el, el.getAttribute(mutation.attributeName));
                            return;
                        }

                        if ((el.nodeName.toLowerCase()) === 'i' && (mutation.attributeName === 'class')) {
                            this.setContentValue(el, el.className);
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

            if (!!el.dataset.fredRte && (el.dataset.fredRte !== 'false')) {
                if (this.config.rte && fredConfig.rtes[this.config.rte]) {
                    fredConfig.rtes[this.config.rte](el, this.onRTEInitFactory(el), this.onRTEContentChangeFactory(el), this.onRTEFocusFactory(wrapper, el), this.onRTEBlurFactory(wrapper, el));
                }
            }

            if (!this.content[el.dataset.fredName]) this.content[el.dataset.fredName] = {};
            if (!this.content[el.dataset.fredName]._raw) this.content[el.dataset.fredName]._raw = {};

            if (el.dataset.fredTarget) {
                if (fredConfig.pageSettings[el.dataset.fredTarget]) {
                    this.content[el.dataset.fredName]._raw._value = fredConfig.pageSettings[el.dataset.fredTarget];
                }
            }

            this.setContentElValue(el);
        }
    }
    
    setElValue(el, value) {
        if (!this.content[el.dataset.fredName]) this.content[el.dataset.fredName] = {};
        if (!this.content[el.dataset.fredName]._raw) this.content[el.dataset.fredName]._raw = {};

        this.content[el.dataset.fredName]._raw._value = value;
        
        switch (el.nodeName.toLowerCase()) {
            case 'i':
                el.className = value;
                break;
            case 'img':
                el.setAttribute('src', value);
                break;
            default:
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
                this.setContentElValue(el, true, false);

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
        element.dzName = zoneName;
        element.parent = this;
        
        this.dzs[zoneName].children.push(element.wrapper);
        this.dzs[zoneName].el.appendChild(element.wrapper);

        return true;
    }
    
    unshiftElementToDropZone(zoneName, element) {
        if (!this.dzs[zoneName]) return false;
        element.dzName = zoneName;
        element.parent = this;

        this.dzs[zoneName].children.unshift(element.wrapper);
        
        if (this.dzs[zoneName].el.firstElementChild) {
            this.dzs[zoneName].el.insertBefore(element.wrapper, this.dzs[zoneName].el.firstElementChild);
        } else {
            this.dzs[zoneName].el.appendChild(element.wrapper);
        }

        return true;
    }
    
    insertBeforeElementToDropZone(zoneName, before, element) {
        if (!this.dzs[zoneName]) return false;
        element.dzName = zoneName;
        element.parent = this;

        this.dzs[zoneName].children.splice(this.dzs[zoneName].children.indexOf(before.wrapper), 0, element.wrapper);
        before.wrapper.insertAdjacentElement('beforebegin', element.wrapper);
    }
}

export default ContentElement;