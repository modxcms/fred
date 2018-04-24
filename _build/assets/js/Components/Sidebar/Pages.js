import Sidebar from '../Sidebar';
import fetch from 'isomorphic-fetch';
import Choices from 'choices.js';
import emitter from "../../EE";

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
        const content = document.createElement('div');
        content.classList.add('fred--pages');

        const pageList = document.createElement('dl');
        pageList.classList.add('fred--pages_list');

        this.buildTree(this.content, pageList);
        
        this.buildCreatePage(pageList);

        content.appendChild(pageList);

        return content;
    }
    
    buildCreatePage(content) {
        const formWrapper = document.createElement('dd');
        
        const form = document.createElement('form');
        form.classList.add('fred--pages_create');
        
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.innerHTML = 'Create Page';

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

        const createButton = document.createElement('button');
        createButton.classList.add('fred--btn-panel', 'fred--btn-apply');
        createButton.innerHTML = 'Create';
        createButton.addEventListener('click', e => {
            e.preventDefault();
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
        
        fieldset.appendChild(legend);
        fieldset.appendChild(parentLabel);
        fieldset.appendChild(parentInput);
        fieldset.appendChild(templateLabel);
        fieldset.appendChild(templateInput);
        fieldset.appendChild(pagetitleLabel);
        fieldset.appendChild(pagetitleInput);
        fieldset.appendChild(createButton);

        form.appendChild(fieldset);

        const button = document.createElement('dt');
        button.setAttribute('role', 'tab');
        button.setAttribute('tabindex', '0');
        button.innerHTML = 'Create Page';

        formWrapper.appendChild(form);

        content.appendChild(button);
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
            
            const dt = document.createElement('dt');
            dt.setAttribute('role', 'tab');
            dt.setAttribute('tabindex', '0');
            dt.innerHTML = page.pagetitle;
            
            if (page.published !== true) {
                dt.classList.add('fred--pages_unpublished');
            }
            
            if (page.deleted === true) {
                dt.classList.add('fred--pages_deleted');
            }
            
            if (page.hidemenu === true) {
                dt.classList.add('fred--pages_hidden');
            }

            wrapper.append(dt);

            if (page.isFred === true) {
                const dd = document.createElement('dd');
                dd.appendChild(this.createMenu(page));

                wrapper.append(dd);
            } else {
                dt.classList.add('fred--pages_noedit');
            }
            
            if (page.children.length > 0) {
                const dl = document.createElement('dl');
                dl.classList.add('fred--pages_list', 'fred--hidden');
                dl.setAttribute('aria-disabled', 'true');
                
                this.buildTree(page.children, dl);

                const expander = document.createElement('button');
                expander.classList.add('fred--btn-list', 'fred--btn-list_expand');
                expander.addEventListener('click', e => {
                    e.preventDefault();
                    
                    if (expander.classList.contains('fred--btn-list_close')) {
                        expander.classList.remove('fred--btn-list_close');
                        dl.classList.add('fred--hidden');
                        dl.setAttribute('aria-disabled', 'true');
                        
                        return;
                    }

                    expander.classList.add('fred--btn-list_close');
                    dl.classList.remove('fred--hidden');
                    dl.setAttribute('aria-disabled', 'false');
                    
                });
                
                dt.insertBefore(expander, dt.firstChild);
                
                wrapper.append(dl);
            }
        });
    }
    
    createMenu(page) {
        const menu = document.createElement('div');
        menu.classList.add('fred--pages_menu');

        const header = document.createElement('h3');
        header.innerHTML = page.pagetitle;

        const edit = document.createElement('button');
        edit.innerHTML = 'Edit';
        edit.addEventListener('click', e => {
            e.preventDefault();
            window.location.href = page.url;
        });
        
        const duplicate = document.createElement('button');
        duplicate.innerHTML = 'Duplicate';
        
        const publish = document.createElement('button');
        if (page.published === true) {
            publish.innerHTML = 'Unpublish';    
        } else {
            publish.innerHTML = 'Publish';
        }
        
        const createChildPage = document.createElement('button');
        createChildPage.innerHTML = 'Create Child Page';
        
        const deletePage = document.createElement('button');
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