import emitter from './EE';
import PagesComponent from './Components/Sidebar/Pages';
import ElementsComponent from './Components/Sidebar/Elements';
import PageSettingsComponent from './Components/Sidebar/PageSettings';
import promiseCancel from 'promise-cancel';
import fredConfig from './Config';
import { div, button, img, h1, dl } from './UI/Elements';

export default class Sidebar {
    constructor(fredWrapper) {
        this.lastRequest = null;
        this.components = [];
        this.visible = false;
        this.fredWrapper = fredWrapper;

        this.hideSidebar = this.hideSidebar.bind(this);
        this.globalHideSidebar = this.globalHideSidebar.bind(this);

        emitter.on('fred-sidebar-expand', (cmp, title, data) => {
            cmp.loading();

            this.components.forEach(component => {
                component.hide();
            });
            
            cmp.expand();
            
            this.lastRequest = promiseCancel(Promise.resolve(data));
            this.lastRequest.promise.then(content => {
                this.lastRequest = null;
                
                cmp.setContent(content);
                
                cmp.afterExpand();
            }).catch(err => {
                this.lastRequest = null;

                if (err.type === 'cancel') {
                    return;
                }
                
                console.log(err);

                cmp.setContent('SOMETHING WRONG HAPPENED');
            });
        });
        
        emitter.on('fred-sidebar-collapse', cmp => {
            if (this.lastRequest !== null) {
                this.lastRequest.cancel();
                this.lastRequest = null;
            }
            
            this.components.forEach(component => {
                component.collapse();
            });
            
        });

        emitter.on('fred-sidebar-hide', silent => {
            this.hideSidebar(silent);
        });

        emitter.on('fred-sidebar-show', silent => {
            this.showSidebar(silent);
        });
        
        emitter.on('fred-sidebar-toggle', () => {
            if (this.wrapper.classList.contains('fred--hidden')) {
                emitter.emit('fred-sidebar-show');
            } else {
                emitter.emit('fred-sidebar-hide');
            }
        });
        
        this.render();
    }

    render() {
        this.wrapper = div(['fred--sidebar', 'fred--hidden']);
        this.wrapper.setAttribute('aria-hidden', 'true');

        this.wrapper.appendChild(this.buildCloseButton());
        this.wrapper.appendChild(this.buildSidebarHeader());
        this.wrapper.appendChild(this.buildSidebar());

        emitter.emit('fred-wrapper-insert', this.wrapper);
        
        return this;
    }

    buildCloseButton() {
        return button('<i class="fred--angle-left"></i><i class="fred--angle-left"></i>', ['fred--sidebar_close'], () => {
            emitter.emit('fred-sidebar-hide');
        });
    }

    buildSidebarHeader() {
        const header = div(['fred--sidebar_title']);
        const logo = img(`${fredConfig.config.assetsUrl || ''}images/modx-revo-icon-48.svg`, 'MODX FRED', ['fred--logo']);
        const title = h1('Fred');

        header.appendChild(logo);
        header.appendChild(title);
        
        return header;
    }

    buildSidebar() {
        this.sidebar = dl(['fred--accordion']);

        this.components.push(new PagesComponent(this.sidebar));
        this.components.push(new ElementsComponent(this.sidebar));
        this.components.push(new PageSettingsComponent(this.sidebar));
        
        return this.sidebar;
    }

    hideSidebar(silent = false) {
        if (silent === false) {
            this.visible = false;
        }
        
        this.wrapper.classList.add('fred--hidden');

        window.removeEventListener('click', this.globalHideSidebar);
    }

    showSidebar(silent = false) {
        if (silent === true) {
           if (this.visible === false) return; 
        }   
            
        this.visible = true;
        this.wrapper.classList.remove('fred--hidden');
        setTimeout(() => {
            window.addEventListener('click', this.globalHideSidebar);
        }, 50);
    }
    
    globalHideSidebar(e) {
        if (!this.fredWrapper.contains(e.target)) {
            this.hideSidebar(false);
        }
    }
}
