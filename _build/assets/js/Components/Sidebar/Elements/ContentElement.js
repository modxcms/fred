import drake from '../../../Drake';
import emitter from '../../../EE';
import { twig } from 'twig';
import fredConfig from '../../../Config';
import {div, button, img, span} from '../../../UI/Elements';
import { applyScripts, valueParser, getTemplateSettings } from '../../../Utils';
import Mousetrap from 'mousetrap';
import hoverintent from 'hoverintent';
import elementSettings from './ElementSettings';
import partialBlueprints from "./PartialBlueprints";
import { renderElement, replaceImage } from '../../../Actions/elements';
import Modal from '../../../Modal';
import html2canvas from "html2canvas";
import cache from '../../../Cache';

export class ContentElement {
    constructor(el, dzName, parent = null, content = {}, settings = {}) {
        this.config = fredConfig.config;
        this.el = el;
        this.template = twig({data: this.el.elementMarkup});
        this.id = this.el.dataset.fredElementId;
        this.title = this.el.dataset.fredElementTitle;
        this.wrapper = null;
        this.invalidTheme = this.el.dataset.invalidTheme === 'true';
        
        this.contentEl = null;
        
        this.setUpEditors();

        this.render = this.render.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.moveDown = this.moveDown.bind(this);

        this.parent = parent;
        this.dzName = dzName;
        this.options = JSON.parse(JSON.stringify((this.el.elementOptions || {})));
        this.content = JSON.parse(JSON.stringify(content));
        
        if (Array.isArray(this.content)) this.content = {};
        
        this.settings = {};
        this.parsedSettings = {};
        this.parsedSettingsClean = {};
        
        if (!this.options.rteConfig) {
            this.options.rteConfig = {};
        }

        if (this.options.settings) {
            this.options.settings.forEach(setting => {
                if (setting.group && setting.settings) {
                    setting.settings.forEach(subSetting => {
                        this.settings[subSetting.name] = (subSetting.value !== undefined) ? subSetting.value : '';    
                    });
                } else {
                    this.settings[setting.name] = (setting.value !== undefined) ? setting.value : '';
                }
            });
        }

        this.settings = {
            ...(this.settings),
            ...JSON.parse(JSON.stringify(settings))
        };
        
        for (let setting in this.settings) {
            if (!this.settings.hasOwnProperty(setting)) continue;
            
            this.parsedSettings[setting] = valueParser(this.settings[setting]);
            this.parsedSettingsClean[setting] = valueParser(this.settings[setting], true);
        }

        this.dzs = {};

        this.inEditor = false;
    }
    
    setSetting(name, value) {
        this.settings[name] = value;
        this.parsedSettings[name] = valueParser(value);
        this.parsedSettingsClean[name] = valueParser(value, true);
        
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
        const t = this;
        hoverintent( wrapper,
            //mouseover
            function(e){

                let firstSet = false;

                if (e.path) {
                    e.path.forEach(el => {
                        if (el.classList && el.classList.contains('fred--block')) {
                            el.classList.add('fred--block-active');

                            if (t.atTop(el)) {
                                el.classList.add('fred--block-active_top');
                            }

                            if (firstSet === true) {
                                el.classList.add('fred--block-active_parent');
                            }

                            if ((firstSet === false) && t.options.settings) {
                                Mousetrap.bind('mod+alt+s', () => {
                                    elementSettings.open(t)
                                });
                            }

                            firstSet = true;
                        }
                    });
                } else {
                    let el = e.target.parentNode;
                    while(el) {
                        if (el.classList && el.classList.contains('fred--block')) {
                            el.classList.add('fred--block-active');

                            if (t.atTop(el)) {
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
            }, //mouseout
            function(e){
                if (t.inEditor === false) {
                    wrapper.classList.remove('fred--block-active');
                    wrapper.classList.remove('fred--block-active_top');
                    wrapper.classList.remove('fred--block-active_parent');

                    let el = e.target.parentNode;
                    let found = false;
                    while(el) {
                        if (el.classList && el.classList.contains('fred--block-active_parent')) {
                            if (found === false) {
                                el.classList.remove('fred--block-active_parent');
                                found = true;
                            }
                        }

                        el = el.parentNode;
                    }

                    if (e.target.hasChildNodes()) {
                        let children = e.target.childNodes;

                        for (let i = 0; i < children.length; i++) {
                            if(children[i].classList && children[i].classList.contains('fred--block-active')){
                                children[i].classList.remove('fred--block-active');
                            }
                        }
                    }

                    Mousetrap.unbind('mod+alt+s');
                }
            }
        ).options({
            sensitivity: 100,
            timeout: 250,
            interval: 250
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
    
    moveDown() {
        if (!fredConfig.permission.fred_element_move) return;
        
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
    }
    
    moveUp() {
        if (!fredConfig.permission.fred_element_move) return;
        
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
        
    }
    
    render() {
        const wrapperClasses = ['fred--block'];
        
        if (this.invalidTheme) {
            wrapperClasses.push('fred--block-invalid');
        }
        
        const wrapper = div(wrapperClasses);
        wrapper.fredEl = this;

        this.setWrapperActiveState(wrapper);

        wrapper.appendChild(this.buildToolbar());

        this.contentEl = div(['fred--block_content']);
        this.contentEl.dataset.fredElementId = this.el.dataset.fredElementId;
        this.contentEl.dataset.fredElementTitle = this.title;

        return this.templateRender().then(html => {
            this.contentEl.innerHTML = html;

            applyScripts(this.contentEl);

            const blockClasses = this.contentEl.querySelectorAll('[data-fred-block-class]');
            for (let blockClass of blockClasses) {
                const classes = blockClass.dataset.fredBlockClass.split(' ').filter(e => {return e;});

                if (classes.length > 0) {
                    wrapper.classList.add(...classes);
                }
            }
            
            this.initElements(wrapper);
            this.initDropZones(wrapper);

            wrapper.appendChild(this.contentEl);
            
            if (this.wrapper !== null) {
                this.wrapper.replaceWith(wrapper);
            }
                
            this.wrapper = wrapper;
            
            return wrapper;
        });
    }

    buildToolbar() {
        const toolbar = div(((!this.invalidTheme && fredConfig.permission.fred_element_move) ? ['fred--toolbar', 'handle'] : ['fred--toolbar']));

        if (!this.invalidTheme && fredConfig.permission.fred_element_move) {
            const moveHandle = div(['fred--toolbar-grip', 'handle']);
            toolbar.appendChild(moveHandle);
        }

        if (!this.invalidTheme && fredConfig.permission.fred_element_screenshot) {
            const elementScreenshot = button('', 'fred.fe.content.element_screenshot', ['fred--element_screenshot'], this.takeScreenshot.bind(this));
            toolbar.appendChild(elementScreenshot);
        }

        if (!this.invalidTheme && fredConfig.permission.fred_blueprints_save) {
            const partialBlueprint = button('', 'fred.fe.content.partial_blueprint', ['fred--blueprint'], () => {partialBlueprints.open(this)});
            toolbar.appendChild(partialBlueprint);
        }

        if (this.options.settings && (this.options.settings.length > 0)) {
            const settings = button('', 'fred.fe.content.settings', ['fred--element-settings'], () => {elementSettings.open(this)});
            toolbar.appendChild(settings);
        }

        if (!this.invalidTheme) {
            const duplicate = button('', 'fred.fe.content.duplicate', ['fred--duplicate-icon'], this.duplicate.bind(this));
            toolbar.appendChild(duplicate);
        }

        if (fredConfig.permission.fred_element_delete) {
            const trashHandle = button('', 'fred.fe.content.delete', ['fred--trash'], this.remove.bind(this));
            toolbar.appendChild(trashHandle);
        }

        if (!this.invalidTheme && fredConfig.permission.fred_element_move) {
            const positionGroup = div(['fred--position-group']);

            const moveUp = button('', 'fred.fe.content.move_up', ['fred--position-up'], this.moveUp);
            const moveDown = button('', 'fred.fe.content.move_down', ['fred--position-down'], this.moveDown);

            positionGroup.appendChild(moveUp);
            positionGroup.appendChild(moveDown);


            toolbar.appendChild(positionGroup);
        }
        
        return toolbar;
    }
    
    takeScreenshot() {
        if (!fredConfig.permission.fred_element_screenshot) return;
        
        let dataImage = '';
        
        const modal = new Modal('Element Screenshot', '', () => {
            emitter.emit('fred-loading', fredConfig.lng('fred.fe.content.element_replacing_thumbnail'));
            
            replaceImage(this.id, dataImage).then(() => {
                cache.kill('elements', {name: 'elements'});
                emitter.emit('fred-loading-hide');
            });
        }, {showCancelButton: true, saveButtonText: 'fred.fe.content.replace_element_thumbnail'});

        const loader = span(['fred--loading']);
        modal.setContent(loader);
        modal.render();
        modal.disableSave();

        html2canvas(this.wrapper, {
            logging: false,
            ignoreElements: el => {
                if (el.classList.contains('fred')) return true;
                if (el.classList.contains('fred--toolbar')) return true;

                return false;
            }
        }).then(canvas => {
            const maxWidth = 540;

            if (canvas.width > maxWidth) {
                const ratio = maxWidth / canvas.width;
                const image = new Image();

                image.onload = () => {
                    const resizedCanvas = document.createElement("canvas");
                    const ctx = resizedCanvas.getContext("2d");

                    resizedCanvas.width = canvas.width * ratio;
                    resizedCanvas.height = canvas.height * ratio;

                    ctx.drawImage(image, 0, 0, resizedCanvas.width, resizedCanvas.height);

                    dataImage = resizedCanvas.toDataURL();

                    modal.setContent(img(dataImage));
                    modal.enableSave();
                };

                image.src = canvas.toDataURL();
            } else {
                dataImage = canvas.toDataURL();

                modal.setContent(img(dataImage));
                modal.enableSave();
            }
        })
        .catch(err => {
            modal.setContent(img('https://via.placeholder.com/300x150/000000/FF0000?text=Generation%20Failed'));
        });
    }
    
    initDropZones(wrapper) {
        const dzs = this.contentEl.querySelectorAll('[data-fred-dropzone]');

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
        return value => {
            this.setValue(el, value);
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
    
    initValue(el, contentEl = null, isPreview = false) {
        if (!this.content[el.dataset.fredName] || Array.isArray(this.content[el.dataset.fredName])) this.content[el.dataset.fredName] = {};
        if (!this.content[el.dataset.fredName]['_raw'] || Array.isArray(this.content[el.dataset.fredName]['_raw'])) this.content[el.dataset.fredName]['_raw'] = {};
        
        let value = this.content[el.dataset.fredName]._raw._value;
        if (value === undefined) {
            switch (el.nodeName) {
                case 'IMG':
                    value = el.getAttribute('src');
                    break;
                case 'I':
                    value = el.className;
                    break;
                default:
                    value = el.innerHTML;
            }
        }

        this.setElValue(el, value, '_value', '_raw', contentEl, isPreview);

        if (el.dataset.fredAttrs) {
            const attrs = el.dataset.fredAttrs.split(',');
            attrs.forEach(attr => {
                let attrValue = this.content[el.dataset.fredName]._raw[attr];
                if (attrValue === undefined) {
                    attrValue = el.getAttribute(attr);
                }

                attrValue = valueParser(attrValue, (!isPreview && (contentEl !== null)));
                
                el.setAttribute(attr, attrValue);
            });
        }
    }
    
    initEvents(el) {
        switch (el.nodeName) {
            case 'IMG':
                if (el.getAttribute('data-fred-editable') === 'true') {
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
            case 'I':
                if (el.getAttribute('data-fred-editable') === 'true') {
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
        }
    }
    
    setValue(el, value, name = '_value', namespace = '_raw', contentEl = null, isPreview = false, silent = false) {
        if (!this.content[el.dataset.fredName] || Array.isArray(this.content[el.dataset.fredName])) this.content[el.dataset.fredName] = {};
        if (!this.content[el.dataset.fredName][namespace] || Array.isArray(this.content[el.dataset.fredName][namespace])) this.content[el.dataset.fredName][namespace] = {};
        
        this.content[el.dataset.fredName][namespace][name] = value;
        value = valueParser(value, (!isPreview && (contentEl !== null)));
        
        if (name === '_value') {
            this.setValueForBindElements(el.dataset.fredName, value, contentEl);
        }
        
        if (!silent && el.dataset.fredTarget) {
            emitter.emit('fred-page-setting-change', el.dataset.fredTarget, this.content[el.dataset.fredName][namespace][name], value, el);
        }
        
        return value;
    }
    
    setElValue(el, value, name = '_value', namespace = '_raw', contentEl = null, isPreview = false, silent = false) {
        value = this.setValue(el, value, name, namespace, contentEl, isPreview, silent);
     
        if (name === '_value') {
            switch (el.nodeName) {
                case 'IMG':
                    el.setAttribute('src', value);
                    break;
                case 'I':
                    el.className = value;
                    break;
                default:
                    el.innerHTML = value;
            }
        } else {
            if (el.dataset.fredAttrs) {
                const attrs = el.dataset.fredAttrs.split(',');
                if (~attrs.indexOf(name)) {
                    el.setAttribute(name, value);
                }
            }
        }
    }

    setValueForBindElements(name, value, contentEl = null) {
        if (contentEl === null) {
            contentEl = this.contentEl;
        }
        
        const bindElements = contentEl.querySelectorAll(`[data-fred-bind="${name}"]`);
        for (let bindEl of bindElements) {
            switch (bindEl.nodeName.toLowerCase()) {
                case 'i':
                    bindEl.className = value;
                    break;
                case 'img':
                    bindEl.setAttribute('src', value);
                    break;
                default:
                    bindEl.innerHTML = value;
            }
        }
    }
    
    getRTEConfig(el) {
        let rteConfig = {};

        if (el.dataset.fredRteConfig && fredConfig.config.rteConfig[el.dataset.fredRteConfig]) {
            rteConfig = fredConfig.config.rteConfig[el.dataset.fredRteConfig];

            if (this.options.rteConfig && this.options.rteConfig[el.dataset.fredRteConfig]) {
                rteConfig = {
                    ...rteConfig,
                    ...this.options.rteConfig[el.dataset.fredRteConfig]
                };
            }

            return rteConfig;
        }

        if (fredConfig.config.rteConfig[this.config.rte]) {
            rteConfig = fredConfig.config.rteConfig[this.config.rte];

            if (this.options.rteConfig && this.options.rteConfig[this.config.rte]) {
                rteConfig = {
                    ...rteConfig,
                    ...this.options.rteConfig[this.config.rte]
                };
            }
        }
        
        return rteConfig;
    }

    getSelectionHtml() {
        let html = "";
        
        if (typeof window.getSelection !== "undefined") {
            const sel = window.getSelection();
            if (sel.rangeCount) {
                const container = document.createElement("div");
                for (let i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                html = container.innerHTML;
            }
        } else if (typeof document.selection !== "undefined") {
            if (document.selection.type === "Text") {
                html = document.selection.createRange().htmlText;
            }
        }
        
        return html;
    }
    
    initElements(wrapper) {
        const fredElements = this.contentEl.querySelectorAll('[data-fred-name]');
        for (let el of fredElements) {
            el.fredEl = this;
            
            if (el.hasAttribute('data-fred-editable') === false) {
                el.setAttribute('data-fred-editable', 'true');
            }
            
            if (['i', 'img'].indexOf(el.nodeName.toLowerCase()) === -1) {
                el.setAttribute('contenteditable', el.getAttribute('data-fred-editable'));
            }
            

            if ((!el.dataset.fredRte || el.dataset.fredRte === 'false' || !el.rteInited)) {
                el.addEventListener('input', () => {
                    this.setValue(el, el.innerHTML);
                });

                el.addEventListener('copy', e => {
                    e.clipboardData.setData('text/plain', window.getSelection().toString());
                    e.clipboardData.setData('text/html', this.getSelectionHtml());
                    e.preventDefault();
                });

                el.addEventListener('cut', e => {
                    e.clipboardData.setData('text/plain', window.getSelection().toString());
                    e.clipboardData.setData('text/html', this.getSelectionHtml());
                    window.getSelection().deleteFromDocument();
                    e.preventDefault();
                });
            }

            if (!!el.dataset.fredRte && (el.dataset.fredRte !== 'false')) {
                if (this.config.rte && fredConfig.rtes[this.config.rte]) {
                    fredConfig.rtes[this.config.rte](el, this.getRTEConfig(el), this.onRTEInitFactory(el), this.onRTEContentChangeFactory(el), this.onRTEFocusFactory(wrapper, el), this.onRTEBlurFactory(wrapper, el));
                }
            }

            if (!this.content[el.dataset.fredName]) this.content[el.dataset.fredName] = {};
            if (!this.content[el.dataset.fredName]._raw) this.content[el.dataset.fredName]._raw = {};

            if (el.dataset.fredTarget) {
                if (fredConfig.pageSettings[el.dataset.fredTarget]) {
                    this.content[el.dataset.fredName]._raw._value = fredConfig.pageSettings[el.dataset.fredTarget];
                }
            }

            this.initValue(el);
            this.initEvents(el);
        }
    }
    
    static getElValue(el, name = '_value', namespace = '_raw') {
        if (!el.dataset.fredName) return '';
        
        return el.fredEl.content[el.dataset.fredName][namespace][name];
    }

    templateRender(parseModx = true, cleanRender = false) {
        if (this.options.remote === true) {
            return this.remoteTemplateRender(parseModx, cleanRender);
        }
        
        return Promise.resolve(this.localTemplateRender(cleanRender));
    }
    
    localTemplateRender(cleanRender = false) {
        return this.template.render({...(cleanRender ? this.parsedSettingsClean : this.parsedSettings), ...(getTemplateSettings(cleanRender))});
    }
    
    remoteTemplateRender(parseModx = true, cleanRender = false) {
        return renderElement(this.id, (cleanRender ? this.parsedSettingsClean : this.parsedSettings), parseModx).then(json => {
            const html = twig({data: json.data.html}).render(getTemplateSettings(cleanRender));
            this.setEl(html);
            
            return html;
        })
        .catch(err => {
            emitter.emit('fred-loading', err.message);
            return '';
        });
    }
    
    cleanRender(parseModx = false, handleLinks = true, isPreview = false) {
        const element = div();
        
        return this.templateRender(parseModx, true).then(html => {
            element.innerHTML = html;
            
            const renderElements = element.querySelectorAll('[data-fred-render]');
            for (let el of renderElements) {
                if (el.getAttribute('data-fred-render') === "false") {
                    el.remove();
                } else {
                    el.removeAttribute('data-fred-render');
                }
            }

            const fredElements = element.querySelectorAll('[data-fred-name]');
            for (let el of fredElements) {
                this.initValue(el, element, isPreview);

                el.removeAttribute('contenteditable');
                el.removeAttribute('data-fred-editable');
                el.removeAttribute('data-fred-name');
                el.removeAttribute('data-fred-rte');
                el.removeAttribute('data-fred-rte-config');
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

            const blockClasses = element.querySelectorAll('[data-fred-block-class]');
            for (let blockClass of blockClasses) {
                const classes = blockClass.dataset.fredBlockClass.split(' ').filter(e => {return e;});

                if (classes.length > 0) {
                    blockClass.classList.add(...classes);
                }

                blockClass.removeAttribute('data-fred-block-class');
            }

            const fredClasses = element.querySelectorAll('[data-fred-class]');
            for (let fredClass of fredClasses) {
                const classes = fredClass.dataset.fredClass.split(' ').filter(e => {return e;});

                if (classes.length > 0) {
                    fredClass.classList.add(...classes);
                }
                
                fredClass.removeAttribute('data-fred-class');
            }
            
            const bindElements = element.querySelectorAll('[data-fred-bind]');
            for (let bindEl of bindElements) {
                bindEl.removeAttribute('data-fred-bind');
            }
            
            const fredOnDrop = element.querySelectorAll('[data-fred-on-drop]');
            for (let onDrop of fredOnDrop) {
                onDrop.removeAttribute('data-fred-on-drop');
            }
            
            const fredOnSettingChange = element.querySelectorAll('[data-fred-on-setting-change]');
            for (let onSettingChange of fredOnSettingChange) {
                onSettingChange.removeAttribute('data-fred-on-setting-change');
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
        if (!fredConfig.permission.fred_element_delete) return;
        
        if (this.parent) {
            const index = this.parent.dzs[this.dzName].children.indexOf(this.wrapper);
            if (index > -1) {
                this.parent.dzs[this.dzName].children.splice(index, 1);
            }
        }

        this.wrapper.remove();

        if (fredConfig.invalidElements) {
            emitter.emit('fred-clear-invalid-elements-warning');
        }
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