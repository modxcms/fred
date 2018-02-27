import Sidebar from '../Sidebar';
import fetch from 'isomorphic-fetch';

export default class Pages extends Sidebar {
    static title = 'Pages';
    static expandable = true;

    init() {
        this.content = null;
    }
    
    click() {
        if (this.content !== null) {
            const content = document.createElement('div');
            content.classList.add('fred--pages');

            const pageList = document.createElement('dl');
            pageList.classList.add('fred--pages_list');

            this.buildTree(this.content, pageList);

            content.appendChild(pageList);


            return content;
        }

        return fetch(`${this.config.assetsUrl}endpoints/ajax.php?action=get-resources`)
            .then(response => {
                return response.json();
            })
            .then(response => {
                const content = document.createElement('div');
                content.classList.add('fred--pages');

                const pageList = document.createElement('dl');
                pageList.classList.add('fred--pages_list');

                console.log(response.data.resources);
                this.content = response.data.resources;
                this.buildTree(response.data.resources, pageList);

                content.appendChild(pageList);


                return content;
            });
    }
    
    buildTree(pages, wrapper) {
        pages.forEach(page => {
            const dt = document.createElement('dt');
            dt.setAttribute('role', 'tab');
            dt.setAttribute('tabindex', '1');
            dt.innerHTML = page.pagetitle;
            
            if (page.published !== true) {
                dt.classList.add('fred--pages_unpublished');
            }
            
            if (page.deleted === true) {
                dt.classList.add('fred--pages_deleted');
            }

            wrapper.append(dt);

            if (page.isFred === true) {
                const dd = document.createElement('dd');
                dd.appendChild(this.createMenu(page));

                wrapper.append(dd);
            }
            
            if (page.children.length > 0) {
                const dl = document.createElement('dl');
                dl.classList.add('fred--pages_list', 'fred--hidden');
                dl.setAttribute('aria-disabled', 'true');
                
                this.buildTree(page.children, dl);

                const expander = document.createElement('span');
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
            console.log('click');
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