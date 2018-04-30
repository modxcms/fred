import Sidebar from '../Sidebar';
import fetch from 'isomorphic-fetch';
import emitter from "../../EE";
import { div, dl, dd, dt, button, h3, form, fieldSet, legend } from '../../UI/Elements';
import { text, choices } from '../../UI/Inputs';
import { errorHandler } from '../../Utils';

export default class Pages extends Sidebar {
    static title = 'Pages';
    static expandable = true;

    init() {
        this.content = null;
        this.parents = [{
            id: 0,
            value: '0',
            label: 'No Parent'
        }];

        this.state = {
            pagetitle: '',
            parent: 0,
            template: 0
        };
    }
    
    click() {
        if (this.content !== null) {
            return this.buildPanel();
        }

        return fetch(`${this.config.assetsUrl}endpoints/ajax.php?action=get-resource-tree`)
            .then(response => {
                return response.json();
            })
            .then(response => {
                this.content = response.data.resources;
                return this.buildPanel();
            });
    }
    
    buildPanel() {
        const content = div(['fred--pages']);
        const pageList = dl(['fred--pages_list']);

        this.buildTree(this.content, pageList);
        this.buildCreatePage(pageList);

        content.appendChild(pageList);

        return content;
    }
    
    buildCreatePage(content) {
        const formWrapper = dd();
        
        const pageForm = form(['fred--pages_create']);
        
        const fields = fieldSet();
        const title = legend('Create Page');

        const onChange = (name, value) => {
            this.state[name] = value;
        };

        const onChangeChoices = (name, value) => {
            this.state[name] = value.value;
        };

        fields.appendChild(title);
        fields.appendChild(choices({
            name: 'parent',
            label: 'Parent',
            choices: {
                choices : this.parents,
                shouldSort: false
            }
        }, this.state.parent, onChangeChoices));

        fields.appendChild(choices({
            name: 'template',
            label: 'Template',
        }, this.state.parent, onChangeChoices, (setting, label, select, choicesInstance, defaultValue) => {
            choicesInstance.ajax(callback => {
                fetch(`${this.config.assetsUrl}endpoints/ajax.php?action=get-templates`)
                    .then(errorHandler)
                    .then(data => {
                        if (data.data.templates[0]) {
                            onChangeChoices('template', data.data.templates[0]);
                            data.data.templates[0].selected = true;
                        }
                        callback(data.data.templates, 'value', 'name');
                    })
                    .catch(error => {
                        console.log(error);
                    });
            });
        }));

        const pagetitle = text({
            name: 'pagetitle',
            label: 'Page Title'
        }, this.state.pagetitle, onChange);
        
        fields.appendChild(pagetitle);
        
        const createButton = button('Create', ['fred--btn-panel', 'fred--btn-apply'], () => {
            emitter.emit('fred-loading', 'Creating Page');
            
            fetch(`${this.config.assetsUrl}endpoints/ajax.php?action=create-resource`, {
                method: "post",
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    parent: this.state.parent,
                    template: this.state.template,
                    pagetitle: this.state.pagetitle
                })
            }).then(errorHandler)
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

        const createPageButton = dt('Create Page');

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
            
            const pageTitle = dt(page.pagetitle);
            
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

            if (page.isFred === true) {
                const pageMenu = dd();
                pageMenu.appendChild(this.createMenu(page));

                wrapper.append(pageMenu);
            } else {
                pageTitle.classList.add('fred--pages_noedit');
            }
            
            if (page.children.length > 0) {
                const children = dl(['fred--hidden']);
                children.setAttribute('aria-disabled', 'true');
                
                this.buildTree(page.children, children);

                const expander = button('', ['fred--btn-list', 'fred--btn-list_expand'], () => {
                    if (expander.classList.contains('fred--btn-list_close')) {
                        expander.classList.remove('fred--btn-list_close');
                        children.classList.add('fred--hidden');
                        children.setAttribute('aria-disabled', 'true');

                        return;
                    }

                    expander.classList.add('fred--btn-list_close');
                    children.classList.remove('fred--hidden');
                    children.setAttribute('aria-disabled', 'false');
                });

                pageTitle.insertBefore(expander, pageTitle.firstChild);
                
                wrapper.append(children);
            }
        });
    }
    
    createMenu(page) {
        const menu = div(['fred--pages_menu']);

        const header = h3(page.pagetitle);

        const edit = button('Edit', [], () => {
            window.location.href = page.url;    
        });
        
        const duplicate = button('Duplicate');
        
        const publish = button();
        if (page.published === true) {
            publish.innerHTML = 'Unpublish';    
        } else {
            publish.innerHTML = 'Publish';
        }
        
        const createChildPage = button('Create Child Page');
        
        const deletePage = button();
        if (page.deleted === true) {
            deletePage.innerHTML = 'Undelete';
        } else {
            deletePage.innerHTML = 'Delete';    
        }
        
        menu.appendChild(header);
        menu.appendChild(edit);
        menu.appendChild(duplicate);
        menu.appendChild(publish);
        menu.appendChild(createChildPage);
        menu.appendChild(deletePage);
        
        return menu;
    }
}