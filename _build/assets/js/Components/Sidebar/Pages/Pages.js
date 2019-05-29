import SidebarPlugin from '../../SidebarPlugin';
import emitter from "../../../EE";
import { div, dl, dd, dt, button, h3, form, fieldSet, legend, a } from '../../../UI/Elements';
import { text, choices, toggle, select } from '../../../UI/Inputs';
import fredConfig from '../../../Config';
import { getResourceTree, getTemplates, createResource, publishResource, unpublishResource, deleteResource, undeleteResource, duplicateResource } from '../../../Actions/pages';
import { getBlueprints } from '../../../Actions/blueprints';
import Modal from "../../../Modal";

export default class Pages extends SidebarPlugin {
    static title = 'fred.fe.pages';
    static icon = 'fred--sidebar_pages';
    static expandable = true;

    init() {
        this.content = null;
        this.openCreatePage = this.openCreatePage.bind(this);

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

        this.parents = [];
        if (fredConfig.permission.new_document_in_root) {
            this.parents.push({
                id: 0,
                value: '0',
                label: fredConfig.lng('fred.fe.pages.no_parent')
            });
        }

        this.buildTree(this.content, this.pageList);

        if (fredConfig.permission.new_document) {
            this.buildCreatePage(this.pageList);
        }

        content.appendChild(this.pageList);

        return content;
    }

    buildCreatePage(content) {
        this.formWrapper = dd();

        const pageForm = form(['fred--pages_create']);

        const fields = fieldSet();
        const title = legend('fred.fe.pages.create_page');

        const onChange = (name, value) => {
            this.state[name] = value;
        };

        const onChangeChoices = (name, value) => {
            if ((name === 'template') && value.customProperties && value.customProperties.theme) {
                this.state.theme = value.customProperties.theme;

                this.blueprintInput.choices.clearStore();
                this.blueprintInput.choices.ajax(callback => {
                    getBlueprints(true, this.state.theme)
                        .then(categories => {
                            const groups = [];

                            categories.forEach(category => {
                                const options = [];

                                category.blueprints.forEach(blueprint => {
                                    const blueprintOption = {
                                        label: blueprint.name,
                                        value: '' + blueprint.id
                                    };

                                    if (value.customProperties.default_blueprint && (blueprint.id === value.customProperties.default_blueprint)) {
                                        blueprintOption.selected = true;
                                        this.state.blueprint = blueprint.id;
                                    }

                                    options.push(blueprintOption);
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

        this.blueprintInput = choices({
            name: 'blueprint',
            label: fredConfig.lng('fred.fe.pages.blueprint'),
            choices: {
                removeItemButton: true
            }
        }, this.state.blueprint, onChangeChoices, (setting, labelEl, selectEl, choicesInstance) => {
            choicesInstance.passedElement.addEventListener('removeItem', event => {
                const value = choicesInstance.getValue(false);
                if (value === undefined) {
                    this.state.blueprint = '0';
                }
            });
        });

        fields.appendChild(title);

        const pagetitle = text({
            name: 'pagetitle',
            label: 'fred.fe.pages.page_title'
        }, this.state.pagetitle, onChange);

        fields.appendChild(pagetitle);

        this.parentInput = choices({
            name: 'parent',
            label: fredConfig.lng('fred.fe.pages.parent'),
            choices: {
                choices : this.parents,
                shouldSort: false
            }
        }, this.state.parent, onChangeChoices, (setting, label, select, choicesInstance, defaultValue) => {
            const id = fredConfig._resource.parent ? fredConfig._resource.parent : (fredConfig.permission.new_document_in_root ? 0 : fredConfig._resource.id);
            choicesInstance.setValueByChoice('' + id);
            this.state.parent = id;
        });

        fields.appendChild(this.parentInput);

        this.templateInput = choices({
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
        });

        fields.appendChild(this.templateInput);

        fields.appendChild(this.blueprintInput);

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

        this.createPageButton = dt('fred.fe.pages.create_page', ['fred--accordion-plus'], this.openCreatePage);
        this.createPageButton.setAttribute('hidden', 'hidden');
        this.createPageButtonSm = button('+','fred.fe.pages.create_page',['fred--btn-small','fred--btn-apply'], this.openCreatePage);
        if (!fredConfig.permission.new_document_in_root && !fredConfig._resource.parent) {
            this.createPageButtonSm.setAttribute('hidden', 'hidden');
        } else {
            this.createPageButtonSm.style.position = 'absolute';
            this.createPageButtonSm.style.top = '8px';
            this.createPageButtonSm.style.right = '32px';
        }

        this.formWrapper.appendChild(pageForm);

        content.appendChild(this.createPageButton);
        content.appendChild(this.formWrapper);
        content.appendChild(this.createPageButtonSm);
    }

    openCreatePage(e) {
        const activeTabs = this.pageList.querySelectorAll('dt.active');

        const isActive = this.createPageButton.classList.contains('active');

        for (let tab of activeTabs) {
            tab.classList.remove('active');
        }

        if (!isActive) {
            this.createPageButton.classList.add('active');
            e.stopPropagation();
            emitter.emit('fred-sidebar-dt-active', this.createPageButton, this.formWrapper);
        }
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
            const duplicate = button('fred.fe.pages.duplicate', 'fred.fe.pages.duplicate', [], () => {
                const duplicateState = {
                    title: 'Duplicate of ' + page.pagetitle,
                    duplicate_children: false,
                    publishing_options: 'preserve'
                };

                const setState = (name, value) => {
                    duplicateState[name] = value;
                };

                const content = [
                    text({
                        label: 'fred.fe.pages.page_title',
                        name: 'pagetitle'
                    }, duplicateState.title, setState)
                ];

                if (page.children.length > 0) {
                    duplicateState.duplicate_children = true;

                    content.push(toggle({
                        label: 'Duplicate Children',
                        name: 'duplicate_children'
                    }, duplicateState.duplicate_children, setState));
                }

                content.push(select({
                    label: 'Publishing Options',
                    name: 'publishing_options',
                    options: {
                        unpublish: 'Make All Unpublished',
                        publish: 'Make All Published',
                        preserve: 'Preserve Published Status',
                    }
                }, duplicateState.publishing_options, setState));

                const modal = new Modal('Duplicate Page', div([], content), () => {
                    duplicateResource(duplicateState.title, duplicateState.duplicate_children, duplicateState.publishing_options, page.id).then((data) => {
                        console.log(data);
                    }).catch(err => {});
                }, {showCancelButton: true});

                modal.render();
            });
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
            const createChildPage = button('fred.fe.pages.create_child_page', 'fred.fe.pages.create_child_page', [], e => {
               this.state.parent = page.id;
               this.parentInput.choices.setValueByChoice('' + page.id);
                this.templateInput.choices.setValueByChoice('' + page.template);

                const template = this.templateInput.choices.getValue();

                if (template.customProperties && template.customProperties.theme) {
                    this.state.theme = template.customProperties.theme;

                    this.blueprintInput.choices.clearStore();
                    this.blueprintInput.choices.ajax(callback => {
                        getBlueprints(true, this.state.theme)
                            .then(categories => {
                                const groups = [];

                                categories.forEach(category => {
                                    const options = [];

                                    category.blueprints.forEach(blueprint => {
                                        const blueprintOption = {
                                            label: blueprint.name,
                                            value: '' + blueprint.id
                                        };

                                        if (template.customProperties.default_blueprint && (blueprint.id === template.customProperties.default_blueprint)) {
                                            blueprintOption.selected = true;
                                            this.state.blueprint = blueprint.id;
                                        }

                                        options.push(blueprintOption);
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

               this.openCreatePage(e);
            });
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
