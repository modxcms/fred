import emitter from './EE';
import Sidebar from './Sidebar/Sidebar';
import Launcher from './Launcher';
import fetch from 'isomorphic-fetch';
import drake from './Drake';
import ContentElement from './Components/Sidebar/Elements/ContentElement';
import ElementSettings from './Components/Sidebar/Elements/ElementSettings';
import libs from './libs';
import Editor from './Editors/Editor';
import fredConfig from './Config';
import { div, section, a, iFrame } from './UI/Elements'
import Finder from './Finder';
import Mousetrap from 'mousetrap';
import MousetrapGlobalBind from 'mousetrap/plugins/global-bind/mousetrap-global-bind.min'

export default class Fred {
    constructor(config = {}) {
        fredConfig.config = config || {};
        this.loading = null;
        this.wrapper = null;
        
        this.libs = libs;
        this.Finder = Finder;
        this.previewDocument = null;
        this.replaceScript = this.replaceScript.bind(this);
        this.scriptsToReplace = [];

        const lexiconsLoaded = this.loadLexicons();
        
        document.addEventListener("DOMContentLoaded", () => {
            const scripts = document.body.querySelectorAll('script-fred');
            for (let script of scripts) {
                const newScript = document.createElement('script');

                for (let i = 0; i < script.attributes.length; i++) {
                    newScript.setAttribute(script.attributes[i].name, script.attributes[i].value);
                }

                if (script.dataset.fredScript) {
                    newScript.innerHTML = script.dataset.fredScript;
                }

                this.scriptsToReplace.push({old: script, 'new': newScript});
            }
            
            lexiconsLoaded.then(() => {
                this.init();
            });
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

        this.phoneP = a(`<span>${fredConfig.lng('fred.fe.preview.phone_portrait')}</span>`, fredConfig.lng('fred.fe.preview.phone_portrait'), '', ['fred--smartphone-portrait'], () => {
            this.iframe.style.width = '320px';
            this.iframe.style.height = '480px';
        });

        this.devices.appendChild(this.phoneP);

        this.phoneL = a(`<span>${fredConfig.lng('fred.fe.preview.phone_landscape')}</span>`, fredConfig.lng('fred.fe.preview.phone_landscape'), '', ['fred--smartphone-landscape'], () => {
            this.iframe.style.width = '480px';
            this.iframe.style.height = '320px';
        });

        this.devices.appendChild(this.phoneL);

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
    
    previewContent() {
        if (!this.previewDocument) {
            this.renderPreview();
            this.iframe.src = fredConfig.config.resource.emptyUrl;
            
            fetch(fredConfig.config.resource.previewUrl).then(response => {
                return response.text();
            }).then(text => {
                const parser = new DOMParser();
                this.previewDocument = parser.parseFromString(text, 'text/html');
                this.getPreviewContent();
            });
        } else {
            this.getPreviewContent();   
        }
    }
    
    getPreviewContent() {
        const promises = [];

        for (let i = 0; i < this.dropzones.length; i++) {
            promises.push(this.getCleanDropZoneContent(this.dropzones[i], true, false).then(content => {
                const dz = this.previewDocument.querySelector('[data-fred-dropzone="' + this.dropzones[i].dataset.fredDropzone + '"]');
                if (dz) {
                    dz.innerHTML = content;
                }
            }));
        }
        
        Promise.all(promises).then(() => {
            this.iframe.contentWindow.document.open();
            this.iframe.contentWindow.document.write(this.previewDocument.documentElement.innerHTML);
            this.iframe.contentWindow.document.close();
            this.iframe.parentNode.style.display = 'block';
        });
    }
    
    renderComponents() {
        new Launcher((fredConfig.config.launcherPosition || 'bottom_left'));
        new Sidebar(this.wrapper);
        new ElementSettings();        
    }

    getDataFromDropZone(dropZone) {
        const data = [];

        for (let child of dropZone.children) {
            data.push(child.fredEl.getContent());
        }

        return data;
    }

    getCleanDropZoneContent(dropZone, parseModx = false, handleLinks = true) {
        let cleanedContent = '';

        const promises = [];
        for (let child of dropZone.children) {
            promises.push(child.fredEl.cleanRender(parseModx, handleLinks));
        }
        
        return Promise.all(promises).then(values => {
            values.forEach(el => {
                cleanedContent += el.innerHTML;
            });
            
            return cleanedContent;
        });
    }

    save() {
        emitter.emit('fred-loading', fredConfig.lng('fred.fe.saving_page'));
        const body = {};
        const data = {};

        const promises = [];
        
        for (let i = 0; i < this.dropzones.length; i++) {
            data[this.dropzones[i].dataset.fredDropzone] = this.getDataFromDropZone(this.dropzones[i]);

            const targets = this.dropzones[i].querySelectorAll('[data-fred-target]:not([data-fred-target=""])');
            for (let target of targets) {
                if (!fredConfig.pageSettings.hasOwnProperty(target.dataset.fredTarget)) {
                    body[target.dataset.fredTarget] = target.innerHTML;
                }
            }
            promises.push(this.getCleanDropZoneContent(this.dropzones[i]).then(content => {
                body[this.dropzones[i].dataset.fredDropzone] = content;    
            }))
        }

        body.id = fredConfig.config.resource.id;
        body.data = data;
        body.pageSettings = fredConfig.pageSettings;

        Promise.all(promises).then(() => {
            fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=save-content`, {
                method: "post",
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then(response => {
                return response.json();
            }).then(json => {
                if (json.url) {
                    location.href = json.url;
                }

                emitter.emit('fred-loading-hide');
            });
        });
    }

    loadContent() {
        emitter.emit('fred-loading', fredConfig.lng('fred.fe.preparing_content'));
        
        return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=load-content&id=${fredConfig.config.resource.id}`, {
            credentials: 'same-origin'
        }).then(response => {
            return response.json();
        }).then(json => {
            const zones = json.data.data;
            if (json.data.pageSettings.tagger && Array.isArray(json.data.pageSettings.tagger)) json.data.pageSettings.tagger = {};
            
            fredConfig.pageSettings = json.data.pageSettings || {};
            fredConfig.tagger = json.data.tagger || {};
            const dzPromises = [];
            
            for (let zoneName in zones) {
                if (zones.hasOwnProperty(zoneName)) {
                    const zoneEl = document.querySelector(`[data-fred-dropzone="${zoneName}"]`);
                    if (zoneEl) {
                        const promises = [];

                        zoneEl.innerHTML = '';
                        zones[zoneName].forEach(element => {
                            const chunk = div(['chunk']);
                            chunk.setAttribute('hidden', 'hidden');
                            chunk.dataset.fredElementId = element.widget;
                            chunk.dataset.fredElementTitle = json.data.elements[element.widget].title;
                            chunk.elementMarkup = json.data.elements[element.widget].html;
                            chunk.elementOptions = json.data.elements[element.widget].options;

                            const contentElement = new ContentElement(chunk, zoneName, null, element.values, (element.settings || {}));
                            promises.push(contentElement.render().then(wrapper => {
                                this.loadChildren(element.children, contentElement, json.data.elements);
                                return wrapper;
                            }));

                        });

                        dzPromises.push(Promise.all(promises).then(wrappers => {
                            wrappers.forEach(wrapper => {
                                zoneEl.appendChild(wrapper);
                            });
                        }));
                    }
                }
            }

            Promise.all(dzPromises).then(() => {
                drake.reloadContainers();
    
                emitter.emit('fred-loading-hide');
            });
        });
    }

    loadChildren(zones, parent, elements) {
        for (let zoneName in zones) {
            if (zones.hasOwnProperty(zoneName)) {
                zones[zoneName].forEach(element => {
                    const chunk = div(['chunk']);
                    chunk.setAttribute('hidden', 'hidden');
                    chunk.dataset.fredElementId = element.widget;
                    chunk.dataset.fredElementTitle = elements[element.widget].title;
                    chunk.elementMarkup = elements[element.widget].html;
                    chunk.elementOptions = elements[element.widget].options || {};
                    
                    const contentElement = new ContentElement(chunk, zoneName, parent, element.values, (element.settings || {}));
                    contentElement.render().then(() => {
                        parent.addElementToDropZone(zoneName, contentElement);
    
                        this.loadChildren(element.children, contentElement, elements);
                    });
                });
            }
        }
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
            this.loading.innerHTML = `<div class="fred--modal" aria-hidden="false"><div style="color:white;text-align:center;"><span class="fred--loading"></span> ${text}</div></div>`;

            this.wrapper.appendChild(this.loading);
        });

        emitter.on('fred-loading-hide', () => {
            if (this.loading !== null) {
                this.loading.remove();
                this.loading = null;
            }
        });

        emitter.on('fred-page-setting-change', (settingName, settingValue, sourceEl) => {
            this.dropzones.forEach(dz => {
                const targets = dz.querySelectorAll(`[data-fred-target="${settingName}"`);
                for (let target of targets) {
                    if (target !== sourceEl) {
                        target.fredEl.setElValue(target, settingValue);
                    }
                }
            });
        });

        emitter.on('fred-preview-on', () => {
            this.previewContent();
        });
        
        emitter.on('fred-preview-off', () => {
            this.iframe.parentNode.style.display = 'none';
        });
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
        
        const editor = initFn(Editor, this);
        
        return fredConfig.registerEditor(name, editor);
    }

    registerRTE(name, initFn) {
        if (typeof initFn !== 'function') {
            console.log('initFn has to be a functions');
            return false;
        }

        const rteInit = initFn(this, fredConfig);

        return fredConfig.registerRTE(name, rteInit);
    }
    
    loadLexicons() {
        let topics = '';
        if (fredConfig.config.lexicons && Array.isArray(fredConfig.config.lexicons)) {
            topics = '&topics=' + fredConfig.config.lexicons.join(',');
        }
        return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=load-lexicons${topics}`, {
            method: "get",
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(json => {
            fredConfig.lang = json.data;
            return true;
        });
    }

    init() {
        this.registerListeners();
        this.registerKeyboardShortcuts();

        this.dropzones = document.querySelectorAll('[data-fred-dropzone]:not([data-fred-dropzone=""])');
        let registeredDropzones = [];

        for (let zoneIndex = 0; zoneIndex < this.dropzones.length; zoneIndex++) {
            if (registeredDropzones.indexOf(this.dropzones[zoneIndex].dataset.fredDropzone) != -1) {
                console.error('There are several dropzones with same name: ' + this.dropzones[zoneIndex].dataset.fredDropzone + '. The name of each dropzone has to be unique.');
                return false;
            }

            registeredDropzones.push(this.dropzones[zoneIndex].dataset.fredDropzone);
        }
        
        if (typeof fredConfig.config.beforeRender === 'function') {
            fredConfig.config.beforeRender = fredConfig.config.beforeRender.bind(this);
            fredConfig.config.beforeRender();
        }

        this.render();
        drake.initDrake();

        this.loadContent().then(() => {
            if (this.scriptsToReplace[0]) {
                this.replaceScript(0);
            }

            this.renderComponents();
        });

    }
    
    replaceScript(index) {
        const next = index + 1;
        
        if (this.scriptsToReplace[index].new.src) {
            this.scriptsToReplace[index].new.addEventListener('load', () => {
                if (this.scriptsToReplace[next]) {
                    this.replaceScript(next);
                }
            });
            
            this.scriptsToReplace[index].old.parentElement.replaceChild(this.scriptsToReplace[index].new, this.scriptsToReplace[index].old);
            return;
        }

        this.scriptsToReplace[index].old.parentElement.replaceChild(this.scriptsToReplace[index].new, this.scriptsToReplace[index].old);
        
        if (this.scriptsToReplace[next]) {
            this.replaceScript(next);
        }
    }
}
