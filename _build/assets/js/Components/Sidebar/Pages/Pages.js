import Sidebar from '../../Sidebar';
import emitter from "../../../EE";
import { div, dl, dd, dt, button, h3, form, fieldSet, legend, a } from '../../../UI/Elements';
import { text, choices } from '../../../UI/Inputs';
import fredConfig from '../../../Config';
import { getResourceTree, getTemplates, createResource, publishResource, unpublishResource, deleteResource, undeleteResource } from '../../../Actions/pages';
import { getBlueprints } from '../../../Actions/blueprints';
import cache from "../../../Cache";

export default class Pages extends Sidebar {
    static title = 'fred.fe.pages';
    static icon = 'fred--sidebar_pages';
    static expandable = true;

    init() {
        this.content = null;

        this.state = {
            pagetitle: '',
            parent: 0,
            blueprint: 0,
            template: 0,
            theme: fredConfig.config.theme
        };
    }

    click() {
        return getResourceTree(this.config.contextKey)
            .then(resources => {
                this.content = resources;
                return this.buildPanel();
            });
    }

    buildPanel() {
        const content = div(['fred--pages']);
        this.pageList = dl(['fred--pages_list']);

        this.parents = [{
            id: 0,
            value: '0',
            label: fredConfig.lng('fred.fe.pages.no_parent')
        }];
        
        this.buildTree(this.content, this.pageList);
        
        if (fredConfig.permission.new_document && fredConfig.permission.new_document_in_root) {
            this.buildCreatePage(this.pageList);
        }

        content.appendChild(this.pageList);

        return content;
    }

    buildCreatePage(content) {
        const formWrapper = dd();

        const pageForm = form(['fred--pages_create']);

        const fields = fieldSet();
        const title = legend('fred.fe.pages.create_page');

        let blueprintChoices = null;
        const blueprintInput = choices({
            name: 'blueprint',
            label: fredConfig.lng('fred.fe.pages.blueprint'),
        }, this.state.parent, onChangeChoices, (setting, label, select, choicesInstance, defaultValue) => {
            blueprintChoices = choicesInstance;
        });
        
        const onChange = (name, value) => {
            this.state[name] = value;
        };

        const onChangeChoices = (name, value) => {
            if ((name === 'template') && value.customProperties && value.customProperties.theme) {
                this.state.theme = value.customProperties.theme;

                blueprintChoices.clearStore();
                blueprintChoices.ajax(callback => {
                    getBlueprints(true, this.state.theme)
                        .then(categories => {
                            const groups = [];

                            categories.forEach(category => {
                                const options = [];

                                category.blueprints.forEach(blueprint => {
                                    options.push({
                                        label: blueprint.name,
                                        value: '' + blueprint.id
                                    });
                                });

                                groups.push({
                                    label: category.category,
                                    disabled: false,
                                    choices: options
                                });
                            });

                            callback(groups, 'value', 'label');
                        })
                        .catch(error => {
                            emitter.emit('fred-loading', error.message);
                        });
                });
            }
            
            this.state[name] = value.value;
        };

        fields.appendChild(title);

        const pagetitle = text({
            name: 'pagetitle',
            label: 'fred.fe.pages.page_title'
        }, this.state.pagetitle, onChange);

        fields.appendChild(pagetitle);
        
        fields.appendChild(choices({
            name: 'parent',
            label: fredConfig.lng('fred.fe.pages.parent'),
            choices: {
                choices : this.parents,
                shouldSort: false
            }
        }, this.state.parent, onChangeChoices));
        
        fields.appendChild(choices({
            name: 'template',
            label: fredConfig.lng('fred.fe.pages.template'),
        }, this.state.parent, onChangeChoices, (setting, label, select, choicesInstance, defaultValue) => {
            choicesInstance.ajax(callback => {
                getTemplates()
                    .then(data => {
                        if (data.data.templates[0]) {
                            onChangeChoices('template', data.data.templates[0]);
                            data.data.templates[0].selected = true;
                        }
                        callback(data.data.templates, 'value', 'name');
                    })
                    .catch(error => {
                        emitter.emit('fred-loading', error.message);
                    });
            });
        }));

        fields.appendChild(blueprintInput);

        const createButton = button('fred.fe.pages.create_page', 'fred.fe.pages.create_page', ['fred--btn-panel', 'fred--btn-apply'], () => {
            if(!fredConfig.permission.new_document){
                alert(fredConfig.lng('fred.fe.permission.new_document'));
                return;
            }

            if(!this.state.parent === 0 && !fredConfig.permission.new_document_in_root){
                alert(fredConfig.lng('fred.fe.permission.new_document_in_root'));
                return;
            }

            emitter.emit('fred-loading', fredConfig.lng('fred.fe.pages.creating_page'));

            createResource(this.state.parent, this.state.template, this.state.pagetitle, this.state.blueprint)
            .then(json => {
                location.href = json.url;
                emitter.emit('fred-loading-hide');
            }).catch(err => {
                if (err.response._fields.pagetitle) {
                    pagetitle.onError(err.response._fields.pagetitle);
                }

                emitter.emit('fred-loading-hide');
            });
        });

        fields.appendChild(createButton);

        pageForm.appendChild(fields);

        const createPageButton = dt('fred.fe.pages.create_page', ['fred--accordion-plus'], (e, el) => {
            const activeTabs = this.pageList.querySelectorAll('dt.active');

            const isActive = el.classList.contains('active');

            for (let tab of activeTabs) {
                tab.classList.remove('active');
            }

            if (!isActive) {
                el.classList.add('active');
                e.stopPropagation();
                emitter.emit('fred-sidebar-dt-active', createPageButton, formWrapper);
            }
        });

        formWrapper.appendChild(pageForm);

        content.appendChild(createPageButton);
        content.appendChild(formWrapper);
    }

    buildTree(pages, wrapper) {
        pages.forEach(page => {
            this.parents.push({
                id: page.id,
                value: '' + page.id,
                label: page.pagetitle
            });

            const pageTitle = dt(page.pagetitle, [], (e, el) => {
                if (e.target !== pageTitle) return;
                const activeTabs = this.pageList.querySelectorAll('dt.active');

                const isActive = el.classList.contains('active');

                for (let tab of activeTabs) {
                    tab.classList.remove('active');
                }

                if (!isActive) {
                    el.classList.add('active');
                    e.stopPropagation();
                    emitter.emit('fred-sidebar-dt-active', pageTitle, pageMenu);
                }
            });

            if (page.published !== true) {
                pageTitle.classList.add('fred--pages_unpublished');
            }

            if (page.deleted === true) {
                pageTitle.classList.add('fred--pages_deleted');
            }

            if (page.hidemenu === true) {
                pageTitle.classList.add('fred--pages_hidden');
            }

            wrapper.append(pageTitle);

            const pageMenu = dd();
            if (page.isFred === true) {
                pageMenu.appendChild(this.createMenu(page));

                wrapper.append(pageMenu);
            } else {
                pageTitle.classList.add('fred--pages_noedit');
            }

            if (page.children.length > 0) {
                const children = dl(['fred--hidden']);
                children.setAttribute('aria-disabled', 'true');

                this.buildTree(page.children, children);

                const expander = button('', 'fred.fe.pages.expand_page', ['fred--btn-list', 'fred--btn-list_expand'], () => {
                    if (expander.classList.contains('fred--btn-list_close')) {
                        expander.classList.remove('fred--btn-list_close');
                        children.classList.add('fred--hidden');
                        children.setAttribute('aria-disabled', 'true');

                        expander.setAttribute('title', fredConfig.lng('fred.fe.pages.collapse_page'));

                        return;
                    }

                    expander.classList.add('fred--btn-list_close');
                    children.classList.remove('fred--hidden');
                    children.setAttribute('aria-disabled', 'false');
                    expander.setAttribute('title', fredConfig.lng('fred.fe.pages.collapse_page'));
                });

                pageTitle.insertBefore(expander, pageTitle.firstChild);

                wrapper.append(children);
            }
        });
    }

    createMenu(page) {
        const menu = div(['fred--pages_menu']);

        const header = h3(page.pagetitle);

        const edit = a('fred.fe.pages.edit', 'fred.fe.pages.edit', page.url);

        menu.appendChild(header);
        menu.appendChild(edit);
        
        if (fredConfig.permission.resource_duplicate) {
            const duplicate = button('fred.fe.pages.duplicate', 'fred.fe.pages.duplicate');
            menu.appendChild(duplicate);
        }

        const publish = button('fred.fe.pages.publish', 'fred.fe.pages.publish', [], () => {
            emitter.emit('fred-loading', fredConfig.lng('fred.fe.pages.publishing_page'));
            
            publishResource(page.id).then(() => {
                publish.replaceWith(unpublish);
                emitter.emit('fred-loading-hide');
            }).catch(err => {
                emitter.emit('fred-loading-hide');
            });
        });
        
        const unpublish = button('fred.fe.pages.unpublish', 'fred.fe.pages.unpublish', [], () => {
            emitter.emit('fred-loading', fredConfig.lng('fred.fe.pages.unpublishing_page'));
            
            unpublishResource(page.id).then(() => {
                unpublish.replaceWith(publish);
                emitter.emit('fred-loading-hide');
            }).catch(err => {
                emitter.emit('fred-loading-hide');
            });
        });
        
        if (page.published === true) {
            if (fredConfig.permission.unpublish_document) {
                menu.appendChild(unpublish);
            }
        } else {
            if (fredConfig.permission.publish_document) {
                menu.appendChild(publish);
            }
        }

        if (fredConfig.permission.new_document) {
            const createChildPage = button('fred.fe.pages.create_child_page', 'fred.fe.pages.create_child_page');
            menu.appendChild(createChildPage);
        }

        const deletePage = button('fred.fe.pages.delete', 'fred.fe.pages.delete', [], () => {
            emitter.emit('fred-loading', fredConfig.lng('fred.fe.pages.deleting_page'));

            deleteResource(page.id).then(() => {
                deletePage.replaceWith(unDeletePage);
                emitter.emit('fred-loading-hide');
            }).catch(err => {
                emitter.emit('fred-loading-hide');
            });
        });
        
        const unDeletePage = button('fred.fe.pages.undelete', 'fred.fe.pages.undelete', [], () => {
            emitter.emit('fred-loading', fredConfig.lng('fred.fe.pages.undeleting_page'));

            undeleteResource(page.id).then(() => {
                unDeletePage.replaceWith(deletePage);
                emitter.emit('fred-loading-hide');
            }).catch(err => {
                emitter.emit('fred-loading-hide');
            });
        });
        
        if (page.deleted === true) {
            if (fredConfig.permission.undelete_document) {
                menu.appendChild(unDeletePage);
            }
        } else {
            if (fredConfig.permission.delete_document) {
                menu.appendChild(deletePage);
            }
        }

        return menu;
    }
}