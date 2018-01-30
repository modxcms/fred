import Sidebar from '../Sidebar';
import dragula from 'dragula';
import emitter from '../../EE';

export default class Widgets extends Sidebar {
    static title = 'Widgets';
    static expandable = true;

    init() {
        this.drake = null;
    }

    click() {
        const content = document.createElement('div');
        content.classList.add('fred--thumbs', 'source');

        content.innerHTML = '<figure class="fred--thumb">\n' +
            '                            <div><img src="http://via.placeholder.com/150x150" alt=""></div>\n' +
            '                            <figcaption>\n' +
            '                                <strong>Container</strong>\n' +
            '                            </figcaption>\n' +
            '                            <div class="chunk" data-fred-id="1" hidden="hidden">\n' +
            '                              <div class="container">\n' +
            '                                <h2 contenteditable="true" data-fred-name="header">Header 2</h2>\n' +
            '                                <p contenteditable="true" data-fred-name="description">Description</p>\n' +
            '                              </div>\n' +
            '                            </div>\n' +
            '                        </figure>\n' +
            '                        <figure class="fred--thumb">\n' +
            '                            <div><img src="' + (this.config.assetsUrl || '') + 'layouts/two-column.jpeg" alt=""></div>\n' +
            '                            <figcaption>\n' +
            '                                <strong>2 Column</strong>\n' +
            '                                <em>Content Left. Component Right.</em>\n' +
            '                            </figcaption>\n' +
            '                            <div class="chunk"  data-fred-id="2" hidden="hidden">\n' +
            '                              <div class="container">\n' +
            '                              <div class="row">\n' +
            '                                <div class="col-6">\n' +
            '                                <h3>Can\'t Edit THIS</h3>\n' +
            '                                <img src="http://via.placeholder.com/350x150" />\n' +
            '                                <p contenteditable="true" data-fred-name="description">Description</p>\n' +
            '                                </div>\n' +
            '                                <div class="col-6">\n' +
            '                                <p contenteditable="true" data-fred-name="description">Description</p>\n' +
            '                                </div>\n' +
            '                              </div>\n' +
            '                              </div>\n' +
            '                            </div>\n' +
            '                        </figure>\n' +
            '                        <figure class="fred--thumb">\n' +
            '                            <div><img src="http://via.placeholder.com/150x150" alt=""></div>\n' +
            '                            <figcaption>\n' +
            '                                <strong>Grid</strong>\n' +
            '                            </figcaption>\n' +
            '                            <div class="chunk" data-fred-id="3" hidden="hidden">\n' +
            '                                <p contenteditable="true" data-fred-name="description">Description Only</p>\n' +
            '                            </div>\n' +
            '                        </figure>';

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(content.outerHTML);
            }, 500);
        })
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
