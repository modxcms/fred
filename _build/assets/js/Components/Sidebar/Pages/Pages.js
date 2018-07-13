import Sidebar from '../../Sidebar';
import emitter from "../../../EE";
import { div, dl, dd, dt, button, h3, form, fieldSet, legend } from '../../../UI/Elements';
import { text, choices } from '../../../UI/Inputs';
import fredConfig from '../../../Config';
import { getResourceTree, getTemplates, createResource } from '../../../Actions/pages';

export default class Pages extends Sidebar {
    static title = 'fred.fe.pages';
    static icon = 'fred--sidebar_pages';
    static expandable = true;

    init() {
        this.content = null;

        this.state = {
            pagetitle: '',
            parent: 0,
            template: 0
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
        this.buildCreatePage(this.pageList);

        content.appendChild(this.pageList);

        return content;
    }

    buildCreatePage(content) {
        const formWrapper = dd();

        const pageForm = form(['fred--pages_create']);

        const fields = fieldSet();
        const title = legend('fred.fe.pages.create_page');

        const onChange = (name, value) => {
            this.state[name] = value;
        };

        const onChangeChoices = (name, value) => {
            this.state[name] = value.value;
        };

        fields.appendChild(title);
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

        const pagetitle = text({
            name: 'pagetitle',
            label: 'fred.fe.pages.page_title'
        }, this.state.pagetitle, onChange);

        fields.appendChild(pagetitle);

        const createButton = button('fred.fe.pages.create_page', 'fred.fe.pages.create_page', ['fred--btn-panel', 'fred--btn-apply'], () => {
            if(!fredConfig.config.permission.new_document){
                alert(fredConfig.lng('fred.fe.permission.new_document'));
                return;
            }

            if(!this.state.parent === 0 && !fredConfig.config.permission.new_document_in_root){
                alert(fredConfig.lng('fred.fe.permission.new_document_in_root'));
                return;
            }

            emitter.emit('fred-loading', fredConfig.lng('fred.fe.pages.creating_page'));

            createResource(this.state.parent, this.state.template, this.state.pagetitle, 0)
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

        const edit = button('fred.fe.pages.edit', 'fred.fe.pages.edit', [], () => {
            window.location.href = page.url;
        });

        const duplicate = button('fred.fe.pages.duplicate', 'fred.fe.pages.duplicate');
        const publish = button('fred.fe.pages.publish', 'fred.fe.pages.publish');
        const unpublish = button('fred.fe.pages.unpublish', 'fred.fe.pages.unpublish');
        const createChildPage = button('fred.fe.pages.create_child_page', 'fred.fe.pages.create_child_page');
        const deletePage = button('fred.fe.pages.delete', 'fred.fe.pages.delete');
        const unDeletePage = button('fred.fe.pages.undelete', 'fred.fe.pages.undelete');

        menu.appendChild(header);
        menu.appendChild(edit);
        menu.appendChild(duplicate);
        
        if (page.published === true) {
            menu.appendChild(unpublish);
        } else {
            menu.appendChild(publish);
        }
        
        menu.appendChild(createChildPage);
        
        if (page.deleted === true) {
            menu.appendChild(unDeletePage);
        } else {
            menu.appendChild(deletePage);
        }

        return menu;
    }
}