import emitter from './EE';
import dragula from 'dragula';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default class Fred {
    constructor(config = {}) {
        this.init();
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('fred');

        this.wrapper.addEventListener('click', e => {
            e.stopPropagation();
        });

        new Topbar(this.wrapper);
        new Sidebar(this.wrapper);

        if (document.body.firstChild === null) {
            document.body.appendChild(this.wrapper);
        } else {
            document.body.insertBefore(this.wrapper, document.body.firstChild);
        }
    }

    showFred() {
        this.wrapper.removeAttribute('hidden');
    }

    hideFred() {
        this.wrapper.setAttribute('hidden', 'hidden');
    }

    init() {
        console.log('Hello from Fred!');

        this.render();

        const self = this;


        const drake = dragula([document.querySelector('.source'), document.querySelector('.content')], {
            copy: function (el, source) {
                return source === document.getElementsByClassName('source')[0]
            },
            accepts: function (el, target) {
                return target !== document.getElementsByClassName('source')[0]
            },
            moves: function (el, source, handle, sibling) {
                if (source.id === 'content') {
                    return handle.classList.contains('handle');
                }

                return true;
            }
        });
        drake.on('drop', (el, target, source, sibling) => {
            if (source.classList.contains('source')) {
                const wrapper = document.createElement('div');
                wrapper.classList.add('test-wrapper');

                const toolbar = document.createElement('div');
                const handle = document.createElement('i');
                handle.classList.add('fa', 'fa-heart', 'handle');

                toolbar.appendChild(handle);

                wrapper.appendChild(toolbar);

                const content = document.createElement('div');
                content.setAttribute('contenteditable', true);
                content.innerHTML = el.getElementsByClassName('chunk')[0].innerHTML;
                content.addEventListener('keypress', e => {
                    if ((e.charCode === 13) && (e.shiftKey === false)) {
                        e.preventDefault();
                        return false;
                    }
                });

                wrapper.appendChild(content);

                el.parentNode.replaceChild(wrapper, el);
            }
        });

        drake.on('drag', (el, source) => {
            self.hideFred();
        });

        drake.on('dragend', el => {
            self.showFred();
        });
    }
}