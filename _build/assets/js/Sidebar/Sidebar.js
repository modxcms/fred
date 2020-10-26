import emitter from './../EE';
import PagesComponent from './../Components/Sidebar/Pages/Pages';
import ElementsComponent from './../Components/Sidebar/Elements/Elements';
import PageSettingsComponent from './../Components/Sidebar/PageSettings';
import MoreComponent from './../Components/Sidebar/More';
import BlueprintsComponent from './../Components/Sidebar/Blueprints/Blueprints';
import promiseCancel from 'promise-cancel';
import View from './SidebarView';
import fredConfig from '@fred/Config';

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
        const components = [PagesComponent];

        if (fredConfig.permission.fred_blueprints) {
            components.push(BlueprintsComponent);
        }

        if (fredConfig.permission.fred_elements) {
            components.push(ElementsComponent);
        }

        if (fredConfig.permission.fred_settings) {
            components.push(PageSettingsComponent);
        }

        for (let pluginName in fredConfig.sidebarPlugins) {
            if (!fredConfig.sidebarPlugins.hasOwnProperty(pluginName)) continue;

            components.push(fredConfig.sidebarPlugins[pluginName]);
        }

        components.push(MoreComponent);

        this.wrapper = View.render(
            components,
            component => {
                this.components.push(component);
            },
            () => {
                emitter.emit('fred-sidebar-hide');
            },
            () => {
                emitter.emit('fred-save');
            },
            () => {
                emitter.emit('fred-preview-on');
            }

        );

        emitter.emit('fred-wrapper-insert', this.wrapper);
    }

    registerListeners() {
        emitter.on('fred-sidebar-expand', (cmp, title, data) => {
            cmp.loading();

            this.components.forEach(component => {
                component.collapse();
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

        emitter.on('fred-sidebar-dt-active', (tab, content) => {
            const listener = e => {
                if ((e.target.parentElement !== null) && !content.contains(e.target)) {
                    tab.classList.remove('active');
                    this.wrapper.removeEventListener('click', listener);
                }
            };

            this.wrapper.addEventListener('click', listener);
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
        if ((e.target.parentElement !== null) && !this.fredWrapper.contains(e.target)) {
            this.components.forEach(component => {
                component.collapse();
            });
        }
    }
}
