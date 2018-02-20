import Sidebar from '../Sidebar';
import drake from '../../drake';
import emitter from '../../EE';
import fetch from 'isomorphic-fetch';
import imageEditor from '../../Editors/ImageEditor';

export default class Elements extends Sidebar {
    static title = 'Elements';
    static expandable = true;

    init() {
        this.content = null;

        emitter.on('fred-dragula-drop', (el, target, source, sibling) => {
            if (source.classList.contains('blueprints-source') && el.parentNode) {
                el.parentNode.replaceChild(Elements.wrapContent(el.getElementsByClassName('chunk')[0]), el);
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

    static reRenderWrapper(children) {
        for (let item of children) {

            const block = item.querySelector('.fred--block');

            if (block) {
                const siblings = [];

                let sibling = block.nextSibling;

                while (sibling) {
                    if (sibling.classList.contains('fred--block')) {
                        siblings.push(sibling);
                    }

                    sibling = sibling.nextSibling;
                }
                const blockContent = Elements.wrapContent(block.querySelector('.fred--block_content'));

                Elements.reRenderWrapper(blockContent.querySelector('.fred--block_content').children);

                block.replaceWith(blockContent);

                siblings.forEach(nextItem => {
                    const siblingContent = Elements.wrapContent(nextItem.querySelector('.fred--block_content'));

                    Elements.reRenderWrapper(siblingContent.querySelector('.fred--block_content').children);

                    nextItem.replaceWith(siblingContent);
                });
            }
        }
    }

    static duplicate(el) {
        const clone = Elements.wrapContent(el.cloneNode(true));

        Elements.reRenderWrapper(clone.querySelector('.fred--block_content').children);

        return clone;
    }

    static wrapContent(el) {
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

            const clone = Elements.duplicate(wrapper.querySelector('.fred--block_content'));

            if (wrapper.nextSibling === null) {
                wrapper.parentNode.appendChild(clone);
            } else {
                wrapper.parentNode.insertBefore(clone, wrapper.nextSibling);
            }

            drake.reloadContainers();
        });

        const trashHandle = document.createElement('button');
        trashHandle.classList.add('fred--trash');
        trashHandle.addEventListener('click', e => {
            e.preventDefault();
            wrapper.remove();
        });

        toolbar.appendChild(moveHandle);

        toolbar.appendChild(duplicate);
        toolbar.appendChild(trashHandle);

        wrapper.appendChild(toolbar);

        const content = document.createElement('div');
        content.classList.add('fred--block_content');
        content.dataset.fredElementId = el.dataset.fredElementId;

        content.innerHTML = el.innerHTML;

        content.querySelectorAll('img[contenteditable="true"]').forEach(img => {
            img.addEventListener('click', e => {
                e.preventDefault();
                imageEditor.edit(img);
            })
        });

        wrapper.appendChild(content);

        return wrapper;
    }

    afterExpand() {
        drake.reloadContainers();
    }
}
