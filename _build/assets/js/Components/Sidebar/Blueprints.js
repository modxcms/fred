import Sidebar from '../Sidebar';
import drake from '../../drake';
import emitter from '../../EE';
import fetch from 'isomorphic-fetch';

export default class Blueprints extends Sidebar {
    static title = 'Blueprints';
    static expandable = true;

    init() {
        this.content = null;
        
        emitter.on('fred-dragula-drop', (el, target, source, sibling) => {
            if (source.classList.contains('blueprints-source')) {
                el.parentNode.replaceChild(this.wrapContent(el.getElementsByClassName('chunk')[0]), el);
            }
        });
    }

    click() {
        if (this.content !== null) {
            return this.content;
        }
        
        return fetch(`${this.config.assetsUrl}endpoints/ajax.php?action=get-blueprints`)
            .then(response => {
                return response.json();
            })
            .then(response => {
                const content = document.createElement('div');
                content.classList.add('fred--thumbs', 'source', 'blueprints-source');
                
                response.data.blueprints.forEach(blueprint => {
                   content.innerHTML += this.blueprintWrapper(blueprint.id, blueprint.title, blueprint.description, blueprint.image, blueprint.content); 
                });
                
                this.content = content.outerHTML;
                
                return this.content;
            });
    }

    blueprintWrapper(id, title, description, image, content) {
        return `<figure class="fred--thumb"><div><img src="${image}" alt=""></div><figcaption><strong>${title}</strong><em>${description}</em></figcaption><div class="chunk" data-fred-blueprint-id="${id}" hidden="hidden">${content}</div></figure>`;
    }

    wrapContent(el) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('fred--block');

        const toolbar = document.createElement('div');
        toolbar.classList.add('fred--toolbar');

        const moveHandle = document.createElement('button');
        moveHandle.classList.add('fred--move-icon', 'handle');

        const duplicate = document.createElement('button');
        duplicate.classList.add('fred--duplicate-icon');
        duplicate.addEventListener('click', e => {
            e.preventDefault();

            const clone = this.wrapContent(wrapper.querySelector('.fred--block_content').cloneNode(true));

            if (wrapper.nextSibling === null) {
                wrapper.parentNode.appendChild(clone);
            } else {
                wrapper.parentNode.insertBefore(clone, wrapper.nextSibling);
            }
        });

        /*
        const moveDownHandle = document.createElement('button');
        moveDownHandle.classList.add('move-down-icon');
        const moveUpHandle = document.createElement('button');
        moveUpHandle.classList.add('move-up-icon');
        */

        /*
        const cogHandle = document.createElement('button');
        cogHandle.classList.add('cog');
        */

        const trashHandle = document.createElement('button');
        trashHandle.classList.add('fred--trash');
        trashHandle.addEventListener('click', e => {
            e.preventDefault();
            wrapper.remove();
        });

        toolbar.appendChild(moveHandle);
        // toolbar.appendChild(moveDownHandle);
        // toolbar.appendChild(moveUpHandle);
        // toolbar.appendChild(cogHandle);
        toolbar.appendChild(duplicate);
        toolbar.appendChild(trashHandle);

        wrapper.appendChild(toolbar);

        const content = document.createElement('div');
        content.classList.add('fred--block_content');
        content.dataset.fredBlueprintId = el.dataset.fredBlueprintId;

        content.innerHTML = el.innerHTML;

        /*
        content.querySelectorAll('[contenteditable]').forEach(item => {

            item.addEventListener('input', e => {
                console.log(e.srcElement.innerHTML);
            })
        });
*/
        /*
        // Prevent creating new paragraph on enter key press
        content.addEventListener('keypress', e => {
            if ((e.charCode === 13) && (e.shiftKey === false)) {
                e.preventDefault();
                return false;
            }
        });*/

        wrapper.appendChild(content);

        return wrapper;
    }

    afterExpand() {
        drake.reloadContainers();
    }
}
