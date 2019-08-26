import drake from '../Drake';
import emitter from '../EE';
import { twig } from 'twig';
import fredConfig from '../Config';
import {div, img} from '../UI/Elements';
import { applyScripts, valueParser, getTemplateSettings } from '../Utils';
import Mousetrap from 'mousetrap';
import hoverintent from 'hoverintent';
import elementSettings from './ElementSettings';
import { renderElement } from '../Actions/elements';
import Toolbar from "./Toolbar";
import jsSHA from "jssha";
import Dropzone from "./Dropzone";

export class Element {
    constructor(el, dropzone, content = {}, settings = {}, pluginsData = {}, elId = null) {
        this.config = fredConfig.config;
        this.el = el;
        this.template = twig({data: this.el.elementMarkup});
        this.id = this.el.dataset.fredElementId;
        this.title = this.el.dataset.fredElementTitle;
        this.wrapper = null;
        this.invalidTheme = this.el.dataset.invalidTheme === 'true';

        if (!elId) {
            this.elId = this.generateElId();
        } else {
            this.elId = elId;
        }

        this.contentEl = null;

        this.setUpEditors();

        this.render = this.render.bind(this);

        this.dropzone = dropzone;

        this.options = JSON.parse(JSON.stringify((this.el.elementOptions || {})));
        this.content = JSON.parse(JSON.stringify(content));
        this.pluginsData = JSON.parse(JSON.stringify(pluginsData));

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

    static fromMarkup(data, markup, dropzone) {
        const chunk = div(['chunk']);
        chunk.setAttribute('hidden', 'hidden');
        chunk.dataset.fredElementId = data.widget;
        chunk.dataset.fredElementTitle = markup.title;
        chunk.dataset.invalidTheme = markup.invalidTheme;
        chunk.elementMarkup = markup.html;
        chunk.elementOptions = markup.options || {};

        return new Element(chunk, dropzone, data.values, (data.settings || {}), (data.pluginsData || {}), (data.elId || null));
    }

    generateElId() {
        const shaObj = new jsSHA("SHA-256", "TEXT");
        shaObj.update(this.title);
        return 'fred_' + shaObj.getHash('HEX').substr(-7) + '_' + Math.random().toString(36).substr(2, 11);
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
            elId: this.elId,
            widget: this.id,
            values: this.content,
            pluginsData: this.pluginsData,
            settings: this.settings,
            children: {}
        };

        for (let dzName in this.dzs) {
            if (this.dzs.hasOwnProperty(dzName)) {
                content.children[dzName] = this.dzs[dzName].getContent();
            }
        }

        return content;
    }

    setWrapperActiveState(wrapper) {
        hoverintent( wrapper,
            //mouseover
            e => {
                let firstSet = false;

                if (e.path) {
                    e.path.forEach(el => {
                        if (el.classList && el.classList.contains('fred--block')) {
                            el.classList.add('fred--block-active');

                            if (fredConfig.sidebar.visible === true) {
                                const sidebarWidth = fredConfig.sidebar.wrapper.clientWidth;
                                const fromLeft = el.getBoundingClientRect().x;

                                const desiredPosition = 20 + sidebarWidth - fromLeft;
                                if (desiredPosition > 0) {
                                    el.fredEl.contentEl.titleEl.style.left = desiredPosition + 'px';
                                }
                            }

                            if (this.atTop(el)) {
                                el.classList.add('fred--block-active_top');
                            }

                            if (this.atHeight(el) || this.atWidth(el)) {
                                el.classList.add('fred--block-active_short');
                            }

                            if (this.atWidth(el)) {
                                el.classList.add('fred--block-active_narrow');
                            }

                            if (firstSet === true) {
                                el.classList.add('fred--block-active_parent');
                                if (el.fredEl.toolbar) {
                                    el.fredEl.toolbar.hidePlugins();
                                }
                            }

                            if ((firstSet === false) && this.options.settings) {
                                Mousetrap.bind('mod+alt+s', () => {
                                    elementSettings.open(this)
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

                            if (this.atTop(el)) {
                                el.classList.add('fred--block-active_top');
                            }

                            if (this.atHeight(el) || this.atWidth(el)) {
                                el.classList.add('fred--block-active_short');
                            }

                            if (this.atWidth(el)) {
                                el.classList.add('fred--block-active_narrow');
                            }

                            if (firstSet === true) {
                                el.classList.add('fred--block-active_parent');
                                if (el.fredEl.toolbar) {
                                    el.fredEl.toolbar.hidePlugins();
                                }
                            }

                            firstSet = true;
                        }

                        el = el.parentNode;
                    }
                }
            }, //mouseout
            e => {
                if (this.inEditor === false) {
                    wrapper.classList.remove('fred--block-active');
                    wrapper.classList.remove('fred--block-active_top');
                    wrapper.classList.remove('fred--block-active_short');
                    wrapper.classList.remove('fred--block-active_narrow');
                    wrapper.classList.remove('fred--block-active_parent');

                    if (wrapper.fredEl) {
                        wrapper.fredEl.contentEl.titleEl.style.left = null;
                        if (wrapper.fredEl.toolbar) {
                            wrapper.fredEl.toolbar.hidePlugins();
                        }
                    }

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
        //console.log('toTop ' + this.toTop)
        return (this.toTop  < 38);
    }

    atHeight(element) {
        //console.log('Height ' + element.offsetHeight)
        return (element.offsetHeight  < 280);
    }

    atWidth(element) {
        //console.log('Width ' + element.offsetWidth)
        return (element.offsetWidth  < 280 || element.offsetHeight  < 160);
    }

    render(refreshCache = false) {
        const wrapperClasses = ['fred--block'];

        if (this.invalidTheme) {
            wrapperClasses.push('fred--block-invalid');
        }

        const wrapper = div(wrapperClasses);
        wrapper.fredEl = this;

        this.setWrapperActiveState(wrapper);

        this.toolbar = new Toolbar(this);
        wrapper.appendChild(this.toolbar.render());

        this.contentEl = div(['fred--block_content']);
        this.contentEl.dataset.fredElementId = this.el.dataset.fredElementId;
        this.contentEl.dataset.fredElementTitle = this.title;

        const titleEl = div(['fred--block_title'], this.title);
        titleEl.addEventListener('click', e => {
            titleEl.classList.add('fred--hidden');
        });
        wrapper.appendChild(titleEl);
        this.contentEl.titleEl = titleEl;


        return this.templateRender(true, false, refreshCache).then(html => {
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
            this.initDropZones();

            wrapper.appendChild(this.contentEl);

            if (this.wrapper !== null) {
                this.wrapper.replaceWith(wrapper);
                drake.reloadContainers();
            }

            this.wrapper = wrapper;

            return wrapper;
        });
    }

    initDropZones() {
        const dzs = this.contentEl.querySelectorAll('[data-fred-dropzone]');

        let prev = null;

        for (let dz of dzs) {
            if (prev === null) {
                prev = dz;

                if (!this.dzs[dz.dataset.fredDropzone]) {
                    dz.dropzone = new Dropzone(dz, this);
                    this.dzs[dz.dataset.fredDropzone] = dz.dropzone;
                } else {
                    dz.dropzone = this.dzs[dz.dataset.fredDropzone];
                    this.dzs[dz.dataset.fredDropzone].el = dz;
                    this.dzs[dz.dataset.fredDropzone].render();
                }

            } else {
                if (!prev.contains(dz)) {
                    prev = dz;

                    if (!this.dzs[dz.dataset.fredDropzone]) {
                        dz.dropzone = new Dropzone(dz, this);
                        this.dzs[dz.dataset.fredDropzone] = dz.dropzone;
                    } else {
                        dz.dropzone = this.dzs[dz.dataset.fredDropzone];
                        this.dzs[dz.dataset.fredDropzone].el = dz;
                        this.dzs[dz.dataset.fredDropzone].render();
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
            const toolbars = wrapper.querySelectorAll('.fred--toolbar');
            for (let toolbar of toolbars){
                toolbar.classList.add('fred--hidden');
            }

            const titles = wrapper.querySelectorAll('.fred--block_title');
            for (let title of titles){
                title.classList.add('fred--hidden');
            }
        }
    }

    onRTEBlurFactory (wrapper, el) {
        return () => {
            this.inEditor = false;
            wrapper.classList.remove('fred--block-active');
            wrapper.classList.remove('fred--block-active_top');
            wrapper.classList.remove('fred--block-active_short');
            wrapper.classList.remove('fred--block-active_narrow');
            wrapper.classList.remove('fred--block-active_parent');

            const toolbars = wrapper.querySelectorAll('.fred--toolbar');
            for (let toolbar of toolbars){
                toolbar.classList.remove('fred--hidden');
            }

            const titles = wrapper.querySelectorAll('.fred--block_title');
            for (let title of titles){
                title.classList.remove('fred--hidden');
            }
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

        if (this.content[el.dataset.fredName][namespace][name] !== value) {
            emitter.emit('fred-content-changed', 'setValue');
        }

        this.content[el.dataset.fredName][namespace][name] = value;
        value = valueParser(value, (!isPreview && (contentEl !== null)));

        if ((namespace === '_raw') && (name === '_value')) {
            this.setValueForBindElements(el.dataset.fredName, value, contentEl);

            if (!silent && el.dataset.fredTarget) {
                emitter.emit('fred-page-setting-change', el.dataset.fredTarget, this.content[el.dataset.fredName][namespace][name], value, el);
            }
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

        let changed = false;

        const bindElements = contentEl.querySelectorAll(`[data-fred-bind="${name}"]`);
        for (let bindEl of bindElements) {
            switch (bindEl.nodeName.toLowerCase()) {
                case 'i':
                    if (bindEl.className !== value) {
                        changed = true;
                    }

                    bindEl.className = value;
                    break;
                case 'img':
                    if (bindEl.getAttribute('src') !== value) {
                        changed = true;
                    }

                    bindEl.setAttribute('src', value);
                    break;
                default:
                    if (bindEl.innerHTML !== value) {
                        changed = true;
                    }

                    bindEl.innerHTML = value;
            }
        }

        if (changed === true) {
            emitter.emit('fred-content-changed', 'setValueForBindElements');
        }
    }

    setPluginValue(namespace, name, value) {
        emitter.emit('fred-content-changed', 'setPluginValue');

        if (Array.isArray(this.pluginsData)) this.pluginsData = {};

        if (!this.pluginsData[namespace] || Array.isArray(this.pluginsData[namespace])) this.pluginsData[namespace] = {};

        this.pluginsData[namespace][name] = value;
    }

    getPluginValue(namespace, name) {
        if (!this.pluginsData[namespace] || Array.isArray(this.pluginsData[namespace])) return undefined;

        return this.pluginsData[namespace][name];
    }

    deletePluginValue(namespace, name = '') {
        if (!name) {
            delete this.pluginsData[namespace];
        }

        if (this.pluginsData[namespace]) {
            delete this.pluginsData[namespace][name];
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

            let rteInitPromise = null;
            if (!!el.dataset.fredRte && (el.dataset.fredRte !== 'false')) {
                if (this.config.rte && fredConfig.rtes[this.config.rte]) {
                    rteInitPromise = fredConfig.rtes[this.config.rte](el, this.getRTEConfig(el), this.onRTEInitFactory(el), this.onRTEContentChangeFactory(el), this.onRTEFocusFactory(wrapper, el), this.onRTEBlurFactory(wrapper, el));
                }
            }

            Promise.resolve(rteInitPromise).then(() => {
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

                    el.addEventListener('paste', e => {
                        e.preventDefault();
                        const text = (e.originalEvent || e).clipboardData.getData('text/plain');

                        document.execCommand("insertHTML", false, text);
                    });

                    el.addEventListener('keydown', e => {
                        if(e.ctrlKey || e.metaKey){
                            if(e.which == 66){
                                e.preventDefault();
                                document.execCommand('bold', false, null);
                            }
                            if(e.which == 73){
                                e.preventDefault();
                                document.execCommand('italic', false, null);
                            }
                            if(e.which == 85){
                                e.preventDefault();
                                document.execCommand('underline', false, null);
                            }
                            if(e.which == 32){
                                e.preventDefault();
                                const text = window.getSelection().toString();
                                window.getSelection().deleteFromDocument();
                                document.execCommand("insertHTML", false, text);
                            }
                        }
                    });

                    el.addEventListener('keyup', e => {
                        if(e.ctrlKey){
                            e.preventDefault();
                        }
                    });

                    el.addEventListener('keypress', e => {
                        if(e.ctrlKey){
                            e.preventDefault();
                        }
                    });
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
            });
        }
    }

    static getElValue(el, name = '_value', namespace = '_raw') {
        if (!el.dataset.fredName) return '';

        return el.fredEl.content[el.dataset.fredName][namespace][name];
    }

    templateRender(parseModx = true, cleanRender = false, refreshCache = false) {
        if (this.options.remote === true) {
            return this.remoteTemplateRender(parseModx, cleanRender, refreshCache);
        }

        return Promise.resolve(this.localTemplateRender(parseModx, cleanRender));
    }

    localTemplateRender(parseModx = true, cleanRender = false) {
        let settings;
        if (cleanRender === true) {
            if (parseModx === true) {
                settings = this.parsedSettings;
            } else {
                settings = this.parsedSettingsClean;
            }
        } else {
            settings = this.parsedSettings;
        }

        return this.template.render({...settings, ...(getTemplateSettings(cleanRender)), id: this.elId});
    }

    remoteTemplateRender(parseModx = true, cleanRender = false, refreshCache = false) {
        const cacheOutput = this.options.cacheOutput === true;

        return renderElement(this.id, {...(cleanRender ? this.parsedSettingsClean : this.parsedSettings), id: this.elId}, parseModx, cacheOutput, refreshCache).then(json => {
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

            const dzMinHeightElements = element.querySelectorAll('[data-fred-min-height]');
            for (let el of dzMinHeightElements) {
                el.removeAttribute('data-fred-min-height');
            }

            const dzMinWidthElements = element.querySelectorAll('[data-fred-min-width]');
            for (let el of dzMinWidthElements) {
                el.removeAttribute('data-fred-min-width');
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

                        if (this.dzs[dzName].elements.length > 0) {
                            dzPromises.push(this.dzs[dzName].getCleanContent(parseModx, handleLinks, isPreview).then(cleanedContent => dzEl.innerHTML = cleanedContent));
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
        if (!fredConfig.permission.fred_element_front_end_delete) return;

        this.dropzone.removeElement(this);

        if (fredConfig.invalidElements) {
            emitter.emit('fred-clear-invalid-elements-warning');
        }
    }

    duplicate() {
        const clone = new Element(this.el, this.dropzone, this.content, this.settings, this.pluginsData);
        clone.render().then(() => {
            for (let dzName in this.dzs) {
                if (this.dzs.hasOwnProperty(dzName)) {
                    this.dzs[dzName].duplicate(clone.dzs[dzName]);
                }
            }

            this.dropzone.insertAfter(clone, this);

            drake.reloadContainers();
        });
    }
}

export default Element;
