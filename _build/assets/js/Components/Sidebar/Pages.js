import Sidebar from '../Sidebar';
import fetch from 'isomorphic-fetch';
import Choices from 'choices.js';
import emitter from "../../EE";
import { div, dl, dd, dt, button, h3, form, fieldSet, legend } from '../../UI/Elements';

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

        const parentLabel = document.createElement('label');
        parentLabel.setAttribute('for', 'fred_create_page_parent');
        parentLabel.classList.add('fred--label-choices');
        parentLabel.innerHTML = 'Parent';
        
        const parentInput = document.createElement('select');
        parentInput.setAttribute('id', 'fred_create_page_parent');
        
        const templateLabel = document.createElement('label');
        templateLabel.setAttribute('for', 'fred_create_page_template');
        templateLabel.classList.add('fred--label-choices');
        templateLabel.innerHTML = 'Template';
        
        const templateInput = document.createElement('select');
        templateInput.setAttribute('id', 'fred_create_page_template');

        const pagetitleLabel = document.createElement('label');
        pagetitleLabel.setAttribute('for', 'fred_create_page_pagetitle');
        pagetitleLabel.innerHTML = 'Page Title';
        
        const pagetitleInput = document.createElement('input');
        pagetitleInput.setAttribute('id', 'fred_create_page_pagetitle');
        pagetitleInput.setAttribute('type', 'text');

        const createButton = button('Create', ['fred--btn-panel', 'fred--btn-apply'], () => {
            emitter.emit('fred-loading', 'Creating Page');

            fetch(`${this.config.assetsUrl}endpoints/ajax.php?action=create-resource`, {
                method: "post",
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    parent: parentInput.value,
                    template: templateInput.value,
                    pagetitle: pagetitleInput.value,
                })
            }).then(response => {
                return response.json();
            }).then(json => {
                location.href = json.url;
                emitter.emit('fred-loading-hide');
            });
        });
        
        fields.appendChild(title);
        fields.appendChild(parentLabel);
        fields.appendChild(parentInput);
        fields.appendChild(templateLabel);
        fields.appendChild(templateInput);
        fields.appendChild(pagetitleLabel);
        fields.appendChild(pagetitleInput);
        fields.appendChild(createButton);

        pageForm.appendChild(fields);

        const createPageButton = dt('Create Page');

        formWrapper.appendChild(pageForm);

        content.appendChild(createPageButton);
        content.appendChild(formWrapper);

        new Choices(parentInput, {
            choices : this.parents,
            shouldSort: false
        });

        const templateInputChoices = new Choices(templateInput);
        templateInputChoices.ajax(callback => {
            fetch(`${this.config.assetsUrl}endpoints/ajax.php?action=get-templates`)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    if (data.data.templates[0]) {
                        data.data.templates[0].selected = true;
                    }
                    callback(data.data.templates, 'value', 'name');
                })
                .catch(error => {
                    console.log(error);
                });
        });
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