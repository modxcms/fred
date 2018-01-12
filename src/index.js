import emitter from './EE';
import dragula from 'dragula';

export default class Fred {
    constructor(config = {}) {
        this.init();
    }


    mockMovements() {
        const wrapper = document.getElementsByClassName('fred')[0];
        const opener = document.getElementsByClassName('fred--open')[0];
        const levelCloser = document.getElementsByClassName('fred--sidebar_close')[0];
        const firstLevel = document.getElementsByClassName('fred--sidebar')[0];
        const secondLevel = document.getElementsByClassName('fred--sidebar_paneltwo')[0];
        
        const firstLevelItems = firstLevel.querySelectorAll('.fred--accordion dt');
        
        let openLevel = null;

        const closeMenu = () => {
            firstLevel.setAttribute('hidden', 'hidden');
            secondLevel.setAttribute('hidden', 'hidden');
            openLevel = null;
            
            window.removeEventListener('click', closeMenu);
        };
        
        opener.addEventListener('click', e => {
            e.preventDefault();
            openLevel = 1;
            firstLevel.removeAttribute('hidden');
            window.addEventListener('click', closeMenu);
        });

        firstLevelItems.forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();
                openLevel = 2;
                secondLevel.removeAttribute('hidden');
            })
        });

        levelCloser.addEventListener('click', e => {
            e.preventDefault();
            
            if (openLevel !== null) {
                if (openLevel === 2) {
                    secondLevel.setAttribute('hidden', 'hidden');
                    openLevel = 1;
                    return;
                }

                if (openLevel === 1) {
                    firstLevel.setAttribute('hidden', 'hidden');
                    openLevel = null;
                    return;
                }
                
            }
        });

        wrapper.addEventListener('click', e => {
            e.stopPropagation();
        });

        this.hideFred = () => {
            wrapper.setAttribute('hidden', 'hidden');
        };

        this.showFred = () => {
            wrapper.removeAttribute('hidden');
        };
    }

    init() {
        console.log('Hello from Fred!');

        this.mockMovements();
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