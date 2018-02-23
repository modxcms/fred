import emitter from './EE';
import PagesComponent from './Components/Sidebar/Pages';
import ElementsComponent from './Components/Sidebar/Elements';
import promiseCancel from 'promise-cancel';
import Modal from './Modal';

export default class Sidebar {
    constructor(fredWrapper, config = {}) {
        this.fredWrapper = fredWrapper;
        this.lastRequest = null;
        this.config = config || {};
        this.components = [];

        this.hideSidebar = this.hideSidebar.bind(this);

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

        emitter.on('fred-sidebar-hide', () => {
            this.hideSidebar();
        });

        emitter.on('fred-sidebar-show', () => {
            this.showSidebar();
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
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('fred--sidebar', 'fred--hidden');
        this.wrapper.setAttribute('aria-hidden', 'true');

        this.wrapper.appendChild(this.buildCloseButton());
        this.wrapper.appendChild(this.buildSidebarHeader());
        this.wrapper.appendChild(this.buildSidebar());

        this.fredWrapper.appendChild(this.wrapper);

        return this;
    }

    buildCloseButton() {
        const button = document.createElement('button');
        button.classList.add('fred--sidebar_close');
        button.setAttribute('role', 'button');
        button.innerHTML = '<i class="fred--angle-left"></i><i class="fred--angle-left"></i>';
        button.addEventListener('click', e => {
            e.preventDefault();
            
            emitter.emit('fred-sidebar-hide');
        });
        
        return button;
    }

    buildSidebarHeader() {
        const header = document.createElement('div');
        header.classList.add('fred--sidebar_title');

        const logo = document.createElement('img');
        logo.setAttribute('alt', 'MODX FRED');
        logo.classList.add('fred--logo');
        logo.src = `${this.config.assetsUrl || ''}images/modx-revo-icon-48.svg`;

        const title = document.createElement('h1');
        title.innerText = 'Fred';

        header.appendChild(logo);
        header.appendChild(title);
        
        return header;
    }

    buildSidebar() {
        this.sidebar = document.createElement('dl');
        this.sidebar.classList.add('fred--accordion');
        this.sidebar.setAttribute('tabindex', '0');
        this.sidebar.setAttribute('role', 'tablist');

        this.components.push(new PagesComponent(this.sidebar, this.config));
        this.components.push(new ElementsComponent(this.sidebar, this.config));
        
        return this.sidebar;
    }

    hideSidebar() {
        this.wrapper.classList.add('fred--hidden');

        window.removeEventListener('click', this.hideSidebar);
    }

    showSidebar() {
        this.wrapper.classList.remove('fred--hidden');
        setTimeout(() => {
            window.addEventListener('click', this.hideSidebar);
        }, 50);
    }
}