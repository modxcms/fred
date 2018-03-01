import Sidebar from '../Sidebar';
import drake from '../../drake';
import emitter from '../../EE';
import fetch from 'isomorphic-fetch';
import ContentElement from './Elements/ContentElement';

export default class Elements extends Sidebar {
    static title = 'Elements';
    static expandable = true;

    init() {
        this.content = null;

        emitter.on('fred-dragula-drop', (el, target, source, sibling) => {
            if (source.classList.contains('blueprints-source') && el.parentNode) {
                el.parentNode.replaceChild((new ContentElement(el.getElementsByClassName('chunk')[0])).wrapper, el);
            }
        });
    }

    click() {
        if (this.content !== null) {
            return this.content;
        }

        return fetch(`${this.config.assetsUrl}endpoints/ajax.php?action=get-elements`)
            .then(response => {
                return response.json();
            })
            .then(response => {
                const content = document.createElement('dl');
                

                response.data.elements.forEach(category => {
                    const dt = document.createElement('dt');
                    dt.setAttribute('role', 'tab');
                    dt.setAttribute('tabindex', '1');
                    dt.innerHTML = category.category;
                    
                    const dd = document.createElement('dd');
                    
                    const categoryEl = document.createElement('div');
                    categoryEl.classList.add('fred--thumbs', 'source', 'blueprints-source');
                    
                    category.elements.forEach(element => {
                        categoryEl.innerHTML += Elements.elementWrapper(element.id, element.title, element.description, element.image, element.content);
                    });

                    dd.appendChild(categoryEl);

                    content.append(dt);
                    content.append(dd);
                });

                this.content = content.outerHTML;

                return this.content;
            });
    }

    static elementWrapper(id, title, description, image, content) {
        return `<figure class="fred--thumb"><div><img src="${image}" alt=""></div><figcaption><strong>${title}</strong><em>${description}</em></figcaption><div class="chunk" data-fred-element-id="${id}" hidden="hidden">${content}</div></figure>`;
    }

    afterExpand() {
        drake.reloadContainers();
    }
}
