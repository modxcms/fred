import emitter from './EE';
import Sidebar from './Sidebar/Sidebar';
import SidebarPlugin from './Components/SidebarPlugin';
import Launcher from './Launcher';
import drake from './Drake';
import Editor from './Editors/Editor';
import fredConfig from './Config';
import {div, section, a, iFrame, span} from './UI/Elements'
import Mousetrap from 'mousetrap';
import MousetrapGlobalBind from 'mousetrap/plugins/global-bind/mousetrap-global-bind.min'
import {loadElements, pluginTools, valueParser, applyScripts} from "./Utils";
import utilitySidebar from './Components/UtilitySidebar';
import { getPreview, saveContent, fetchContent, fetchLexicons } from './Actions/fred';
import Element from "./Content/Element";
import ToolbarPlugin from "./Content/Toolbar/ToolbarPlugin";
import Dropzone from "./Content/Dropzone";

export default class Fred {
    constructor(config = {}) {
        fredConfig.jwt = config.jwt;
        delete config.jwt;

        if (typeof config.modifyPermissions === 'function') {
            config.modifyPermissions = config.modifyPermissions.bind(this);
            config.permission = config.modifyPermissions(config.permission);
        }

        fredConfig.permission = config.permission;
        delete config.permission;

        fredConfig.resource = config.resource;
        delete config.resource;

        fredConfig.config = config || {};
        fredConfig.fred = this;
        this.loading = null;
        this.wrapper = null;
        this.fingerprint = '';

        this.previewDocument = null;

        this.unsavedChanges = false;

        window.onbeforeunload = () => {
            if (this.unsavedChanges === true) {
                return fredConfig.lng('fred.fe.unsaved_data_warning');
            } else {
                return;
            }
        };

        const lexiconsLoaded = this.loadLexicons();

        document.addEventListener("DOMContentLoaded", async () => {
            await lexiconsLoaded;
            await this.init();
        });
    }

    render() {
        this.wrapper = div(['fred']);

        document.body.appendChild(this.wrapper);
    }

    renderPreview() {
        const previewWrapper = div(['fred--content-preview']);
        previewWrapper.style.display = 'none';

        this.iframe = iFrame('#');
        this.iframe.style.width = '100%';
        this.iframe.style.height = '100%';

        this.controls = div(['fred--content-preview_controls']);

        this.devices = div(['fred--devices']);

        this.phoneP = a(`<span>${fredConfig.lng('fred.fe.preview.phone_portrait')}</span>`, fredConfig.lng('fred.fe.preview.phone_portrait'), '', ['fred--smartphone-portrait'], () => {
            this.iframe.style.width = '375px';
            this.iframe.style.height = '667px';
        });

        this.devices.appendChild(this.phoneP);

        this.phoneL = a(`<span>${fredConfig.lng('fred.fe.preview.phone_landscape')}</span>`, fredConfig.lng('fred.fe.preview.phone_landscape'), '', ['fred--smartphone-landscape'], () => {
            this.iframe.style.width = '667px';
            this.iframe.style.height = '375px';
        });

        this.devices.appendChild(this.phoneL);

        this.tabletP = a(`<span>${fredConfig.lng('fred.fe.preview.tablet_portrait')}</span>`, fredConfig.lng('fred.fe.preview.tablet_portrait'), '', ['fred--tablet-portrait'], () => {
            this.iframe.style.width = '768px';
            this.iframe.style.height = '1024px';
        });

        this.devices.appendChild(this.tabletP);

        this.tabletL = a(`<span>${fredConfig.lng('fred.fe.preview.tablet_landscape')}</span>`, fredConfig.lng('fred.fe.preview.tablet_landscape'), '', ['fred--tablet-landscape'], () => {
            this.iframe.style.width = '1024px';
            this.iframe.style.height = '768px';
        });

        this.devices.appendChild(this.tabletL);

        this.auto = a(`<span>${fredConfig.lng('fred.fe.preview.auto')}</span>`, fredConfig.lng('fred.fe.preview.auto'), '', ['fred--auto'], () => {
            this.iframe.style.width = '100%';
            this.iframe.style.height = '100%';
        });

        this.devices.appendChild(this.auto);

        this.controls.appendChild(this.devices);


        previewWrapper.append(this.controls);

        previewWrapper.appendChild(this.iframe);

        this.wrapper.insertBefore(previewWrapper, this.wrapper.firstChild);
    }

    async previewContent() {
        if (!this.previewDocument) {
            this.renderPreview();
            this.iframe.src = fredConfig.resource.emptyUrl;

            const text = await getPreview();

            const parser = new DOMParser();
            this.previewDocument = parser.parseFromString(text, 'text/html');
        }

        return this.getPreviewContent();
    }

    async getPreviewContent() {
        const promises = [];

        this.dropzones.forEach(dropzone => {
            promises.push(dropzone.getCleanContent(true, false, true).then(content => {
                const dz = this.previewDocument.querySelector('[data-fred-dropzone="' + dropzone.name + '"]');
                if (dz) {
                    dz.innerHTML = content;
                }
            }));
        });

        let base = this.previewDocument.querySelector('base');
        if (base) {
            base.setAttribute('target', '_blank');
        } else {
            base = document.createElement('base');
            base.setAttribute('target', '_blank');
            const head = this.previewDocument.querySelector('head');
            head.appendChild(base);
        }

        await Promise.all(promises);

        this.iframe.contentWindow.document.open();
        this.iframe.contentWindow.document.write(this.previewDocument.documentElement.innerHTML);
        this.iframe.contentWindow.document.close();

        return new Promise(resolve => {
            this.iframe.onload = resolve;
        }).then(() => {
            return this.iframe;
        });
    }

    renderComponents() {
        fredConfig.launcher = new Launcher((fredConfig.config.launcherPosition || 'bottom_left'));
        fredConfig.sidebar = new Sidebar(this.wrapper);
        utilitySidebar.render();
    }

    async save() {
        if(!fredConfig.permission.save_document){
            return;
        }

        emitter.emit('fred-loading', fredConfig.lng('fred.fe.saving_page'));
        const body = {};
        const data = {};

        const promises = [];

        this.dropzones.forEach(dropzone => {
            data[dropzone.name] = dropzone.getContent();

            const targets = dropzone.el.querySelectorAll('[data-fred-target]:not([data-fred-target=""])');
            for (let target of targets) {
                if (fredConfig.pageSettings.hasOwnProperty(target.dataset.fredTarget)) {
                    fredConfig.pageSettings[target.dataset.fredTarget] = Element.getElValue(target);
                    continue;
                }

                if ((target.dataset.fredTarget.indexOf('tv_') === 0) && (target.dataset.fredTarget.substr(3) !== '')) {
                    fredConfig.pageSettings.tvs[target.dataset.fredTarget.substr(3)] = Element.getElValue(target);
                    continue;
                }

                body[target.dataset.fredTarget] = Element.getElValue(target);
            }

            promises.push(dropzone.getCleanContent().then(content => body[dropzone.name] = content));
        });

        body.id = fredConfig.resource.id;
        body.data = data;
        body.plugins = fredConfig.pluginsData;
        body.pageSettings = JSON.parse(JSON.stringify(fredConfig.pageSettings));
        body.fingerprint = this.fingerprint;

        if (body.pageSettings.tvs) {
            for (let tvName in body.pageSettings.tvs) {
                if (body.pageSettings.tvs.hasOwnProperty(tvName)) {
                    body.pageSettings.tvs[tvName] = valueParser(body.pageSettings.tvs[tvName], true);
                }
            }
        }

        await Promise.all(promises);
        try {
            const json = await saveContent(body);
            this.unsavedChanges = false;

            if (json.url) {
                location.href = json.url;
            }

            if (json.fingerprint) {
                this.fingerprint = json.fingerprint;
            }

            fredConfig.pageSettings.publishedon = json.publishedon;
            fredConfig.pageSettings.alias = json.alias;

            emitter.emit('fred-loading-hide');
            emitter.emit('fred-after-save');
        } catch(err) {
            if (err.response) {
                console.error(err.response.message);
                alert(err.response.message);
            }

            emitter.emit('fred-loading-hide');
        }
    }

    async loadContent() {
        emitter.emit('fred-loading', fredConfig.lng('fred.fe.preparing_content'));

        const json = await fetchContent();
        if (json.data.pageSettings.tagger && Array.isArray(json.data.pageSettings.tagger)) json.data.pageSettings.tagger = {};

        this.fingerprint = json.data.fingerprint || '';
        fredConfig.pageSettings = json.data.pageSettings || {};
        fredConfig.tagger = json.data.tagger || [];
        fredConfig.tvs = json.data.tvs || [];
        fredConfig.pluginsData = json.data.plugins || {};

        this.renderComponents();

        await loadElements(json.data);

        drake.reloadContainers();

        if (document.querySelectorAll('.fred--block-invalid').length > 0) {
            fredConfig.invalidElements = true;

            this.invalidElementsWarning = div(['fred--alert-invalid'], 'fred.fe.invalid_elements_warning');
            this.wrapper.appendChild(this.invalidElementsWarning);
        }

        emitter.emit('fred-loading-hide');
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

            this.loading = section(['fred--modal-bg', 'fred--modal_loading']);
            const modal = div('fred--modal');
            modal.setAttribute('aria-hidden', 'false');

            const inner = div();
            inner.style.color = 'white';
            inner.style.textAlign= 'center';

            const spinner = span('fred--loading');
            const textSpan = span();
            textSpan.innerHTML = text;

            inner.appendChild(spinner);
            inner.appendChild(textSpan);

            this.loading.setText = (text = '') => {
                textSpan.innerHTML = text;
            };

            modal.appendChild(inner);

            this.loading.appendChild(modal);

            this.wrapper.appendChild(this.loading);
        });

        emitter.on('fred-loading-change', text => {
            if (this.loading === null) return;

            text = text || '';
            this.loading.setText(text);
        });

        emitter.on('fred-loading-hide', () => {
            if (this.loading !== null) {
                this.loading.remove();
                this.loading = null;
            }
        });

        emitter.on('fred-page-setting-change', (settingName, settingValue, parsedValue, sourceEl) => {
            this.dropzones.forEach(dz => {
                const targets = dz.el.querySelectorAll(`[data-fred-target="${settingName}"]`);
                for (let target of targets) {
                    if (target !== sourceEl) {
                        target.fredEl.setElValue(target, settingValue, '_value', '_raw', null, false, true);
                    }
                }
            });
        });

        emitter.on('fred-preview-on', async () => {
            const iframe = await this.previewContent();
            document.body.classList.add('fred--fixed');
            iframe.parentNode.style.opacity = null;
            iframe.parentNode.style.zIndex = null;
            iframe.parentNode.style.display = 'block';
        });

        emitter.on('fred-preview-off', () => {
            document.body.classList.remove('fred--fixed');
            this.iframe.parentNode.style.opacity = null;
            this.iframe.parentNode.style.zIndex = null;
            this.iframe.parentNode.style.display = 'none';
        });

        emitter.on('fred-logout-user', () => {
            this.logoutUser();
        });

        emitter.on('fred-clear-invalid-elements-warning', () => {
            if (document.querySelectorAll('.fred--block-invalid').length === 0) {
                fredConfig.invalidElements = false;
                if (this.invalidElementsWarning) {
                    this.invalidElementsWarning.remove();
                }
            }
        });

        emitter.on('fred-content-changed', () => {
            this.unsavedChanges = true;
        })
    }

    registerKeyboardShortcuts() {
        Mousetrap.bindGlobal('mod+s', e => {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }

            emitter.emit('fred-save');
        });

        Mousetrap.bind('up up down down left right left right b a enter', () => {
            (function(){function c(){var e=document.createElement("link");e.setAttribute("type","text/css");e.setAttribute("rel","stylesheet");e.setAttribute("href",f);e.setAttribute("class",l);document.body.appendChild(e)}function h(){var e=document.getElementsByClassName(l);for(var t=0;t<e.length;t++){document.body.removeChild(e[t])}}function p(){var e=document.createElement("div");e.setAttribute("class",a);document.body.appendChild(e);setTimeout(function(){document.body.removeChild(e)},100)}function d(e){return{height:e.offsetHeight,width:e.offsetWidth}}function v(i){var s=d(i);return s.height>e&&s.height<n&&s.width>t&&s.width<r}function m(e){var t=e;var n=0;while(!!t){n+=t.offsetTop;t=t.offsetParent}return n}function g(){var e=document.documentElement;if(!!window.innerWidth){return window.innerHeight}else if(e&&!isNaN(e.clientHeight)){return e.clientHeight}return 0}function y(){if(window.pageYOffset){return window.pageYOffset}return Math.max(document.documentElement.scrollTop,document.body.scrollTop)}function E(e){var t=m(e);return t>=w&&t<=b+w}function S(){var e=document.createElement("audio");e.setAttribute("class",l);e.src=i;e.loop=false;e.addEventListener("canplay",function(){setTimeout(function(){x(k)},500);setTimeout(function(){N();p();for(var e=0;e<O.length;e++){T(O[e])}},15500)},true);e.addEventListener("ended",function(){N();h()},true);e.innerHTML=" <p>If you are reading this, it is because your browser does not support the audio element. We recommend that you get a new browser.</p> <p>";document.body.appendChild(e);e.play()}function x(e){e.className+=" "+s+" "+o}function T(e){e.className+=" "+s+" "+u[Math.floor(Math.random()*u.length)]}function N(){var e=document.getElementsByClassName(s);var t=new RegExp("\\b"+s+"\\b");for(var n=0;n<e.length;){e[n].className=e[n].className.replace(t,"")}}var e=30;var t=30;var n=350;var r=350;var i="//s3.amazonaws.com/moovweb-marketing/playground/harlem-shake.mp3";var s="mw-harlem_shake_me";var o="im_first";var u=["im_drunk","im_baked","im_trippin","im_blown"];var a="mw-strobe_light";var f="//s3.amazonaws.com/moovweb-marketing/playground/harlem-shake-style.css";var l="mw_added_css";var b=g();var w=y();var C=document.getElementsByTagName("*");var k=null;for(var L=0;L<C.length;L++){var A=C[L];if(v(A)){if(E(A)){k=A;break}}}if(A===null){console.warn("Could not find a node of the right size. Please try a different page.");return}c();S();var O=[];for(var L=0;L<C.length;L++){var A=C[L];if(v(A)){O.push(A)}}})();
        });
    }

    registerEditor(name, initFn) {
        if (typeof initFn !== 'function') {
            console.log('initFn has to be a functions');
            return false;
        }

        return fredConfig.registerEditor(name, initFn(this, Editor, pluginTools()));
    }

    registerRTE(name, initFn) {
        if (typeof initFn !== 'function') {
            console.log('initFn has to be a functions');
            return false;
        }

        return fredConfig.registerRTE(name, initFn(this, pluginTools()));
    }

    registerSidebarPlugin(name, initFn) {
        if (typeof initFn !== 'function') {
            console.log('initFn has to be a functions');
            return false;
        }

        return fredConfig.registerSidebarPlugin(name, initFn(this, SidebarPlugin, pluginTools()));
    }

    registerToolbarPlugin(name, initFn) {
        if (typeof initFn !== 'function') {
            console.log('initFn has to be a functions');
            return false;
        }

        return fredConfig.registerToolbarPlugin(name, initFn(this, ToolbarPlugin, pluginTools()));
    }

    async loadLexicons() {
        let topics = '';
        if (fredConfig.config.lexicons && Array.isArray(fredConfig.config.lexicons)) {
            topics = '&topics=' + fredConfig.config.lexicons.join(',');
        }

        const json = await fetchLexicons(topics);
        fredConfig.lang = json.data;

        return true;
    }

    async init() {
        this.registerListeners();
        this.registerKeyboardShortcuts();

        this.dropzones = [];
        const dropzones = document.querySelectorAll('[data-fred-dropzone]:not([data-fred-dropzone=""])');
        const registeredDropzones = [];

        for (let dz of dropzones) {
            if (registeredDropzones.indexOf(dz.dataset.fredDropzone) !== -1) {
                console.error('There are several dropzones with same name: ' + dz.dataset.fredDropzone + '. The name of each dropzone has to be unique.');
                return false;
            }

            registeredDropzones.push(dz.dataset.fredDropzone);
            dz.dropzone = new Dropzone(dz, null);

            this.dropzones.push(dz.dropzone);
        }

        if (typeof fredConfig.config.beforeRender === 'function') {
            fredConfig.config.beforeRender = fredConfig.config.beforeRender.bind(this);
            fredConfig.config.beforeRender();
        }

        this.render();
        drake.initDrake();

        await this.loadContent();
        await applyScripts(document.body);
    }

    getContent(noId = false) {
        const data = {};

        this.dropzones.forEach(dropzone => data[dropzone.name] = dropzone.getContent(noId));

        return data;
    }

    logoutUser() {
        if (fredConfig.config.logoutUrl) {
            document.location.href = fredConfig.config.logoutUrl;
            return;
        }

        document.location.href = fredConfig.config.managerUrl + '?a=security/logout';
    }
}
