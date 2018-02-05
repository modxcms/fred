import Sidebar from '../Sidebar';
import dragula from 'dragula';
import emitter from '../../EE';
import fetch from 'isomorphic-fetch';

export default class Atoms extends Sidebar {
    static title = 'Atoms';
    static expandable = true;

    init() {
        this.drake = null;
        this.content = null;
    }

    click() {
        if (this.content !== null) {
            return this.content;
        }
        
        return fetch(`${this.config.assetsUrl}endpoints/ajax.php?action=get-atoms`)
            .then(response => {
                return response.json();
            })
            .then(response => {
                const content = document.createElement('div');
                content.classList.add('fred--thumbs', 'source');
                
                response.data.widgets.forEach(widget => {
                   content.innerHTML += this.widgetWrapper(widget.id, widget.title, widget.description, widget.image, widget.content); 
                });
                
                this.content = content.outerHTML;
                
                return this.content;
            });
    }
    
    widgetWrapper(id, title, description, image, content) {
        return `<figure class="fred--thumb"><div><img src="${image}" alt=""></div><figcaption><strong>${title}</strong><em>${description}</em></figcaption><div class="chunk" data-fred-id="${id}" hidden="hidden">${content}</div></figure>`;
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
        content.dataset.fredId = el.dataset.fredId;

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
        if (this.drake === null) {
            const containers = [...document.querySelectorAll('[data-fred-dropzone]:not([data-fred-dropzone=""])')];
            containers.unshift(document.querySelector('.source'));

            this.drake = dragula(containers, {
                copy: function (el, source) {
                    return source === document.getElementsByClassName('source')[0]
                },
                accepts: function (el, target) {
                    return target !== document.getElementsByClassName('source')[0]
                },
                moves: function (el, source, handle, sibling) {
                    if ((source.dataset.fredDropzone !== undefined) && (source.dataset.fredDropzone !== '')) {
                        return handle.classList.contains('handle');
                    }

                    return true;
                }
            });

            this.drake.on('drop', (el, target, source, sibling) => {
                if (source.classList.contains('source')) {
                    el.parentNode.replaceChild(this.wrapContent(el.getElementsByClassName('chunk')[0]), el);
                }
            });

            this.drake.on('drag', (el, source) => {
                emitter.emit('fred-sidebar-hide');
            });

            this.drake.on('dragend', el => {
                emitter.emit('fred-sidebar-show');
            });
        } else {
            const containers = [...document.querySelectorAll('[data-fred-dropzone]:not([data-fred-dropzone=""])')];
            containers.unshift(document.querySelector('.source'));

            this.drake.containers = containers;
        }
    }
}
