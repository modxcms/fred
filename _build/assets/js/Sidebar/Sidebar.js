import emitter from './../EE';
import PagesComponent from './../Components/Sidebar/Pages';
import ElementsComponent from './../Components/Sidebar/Elements';
import PageSettingsComponent from './../Components/Sidebar/PageSettings';
import promiseCancel from 'promise-cancel';
import View from './SidebarView';

export default class Sidebar {
    constructor(fredWrapper) {
        this.lastRequest = null;
        this.components = [];
        this.visible = false;
        this.fredWrapper = fredWrapper;

        this.hideSidebar = this.hideSidebar.bind(this);
        this.globalHideSidebar = this.globalHideSidebar.bind(this);

        this.registerListeners();
        this.render();
    }

    render() {
        emitter.emit('fred-wrapper-insert', View.render(
            [PagesComponent, ElementsComponent, PageSettingsComponent],
            component => {
                this.components.push(component);
            },
            () => {
                emitter.emit('fred-sidebar-hide');
            }
            
        ));
    }
    
    registerListeners() {
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
            if (View.isVisible()) {
                emitter.emit('fred-sidebar-hide');
            } else {
                emitter.emit('fred-sidebar-show');
            }
        });
    }

    hideSidebar(silent = false) {
        if (silent === false) {
            this.visible = false;
        }

        View.hide();

        window.removeEventListener('click', this.globalHideSidebar);
    }

    showSidebar(silent = false) {
        if (silent === true) {
           if (this.visible === false) return; 
        }   
            
        this.visible = true;
        
        View.show();
        
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
