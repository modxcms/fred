import emitter from '../EE';

export default class Sidebar {
    static title = 'TITLE NOT SET';
    static expandable = false;

    constructor(sidebarWrapper, config = {}) {
        this.sidebarWrapper = sidebarWrapper;
        this.config = config || {};
        this.titleEl = null;
        this.contentEl = null;
        
        const render = (text, expandable = false) => {
            this.titleEl = document.createElement('dt');
            this.titleEl.setAttribute('role', 'tab');
            this.titleEl.setAttribute('tabindex', '0');
            this.titleEl.classList.add(`fred--sidebar_${this.constructor.title.toLowerCase().replace(/ /g, '_')}`);

            this.titleEl.innerHTML = text + ((expandable === true) ? '<i class="fred--angle-right fred--accordion_toggle"></i>' : '');

            if (expandable === false) {
                this.titleEl.addEventListener('click', this.click);
            } else {
                this.titleEl.addEventListener('click', () => {
                    if (this.titleEl.classList.contains('active')) {
                        emitter.emit('fred-sidebar-collapse', this);
                    } else {
                        emitter.emit('fred-sidebar-expand', this, text, this.click());
                    }
                });
            }

            this.contentEl = document.createElement('dd');

            this.sidebarWrapper.appendChild(this.titleEl);
            this.sidebarWrapper.appendChild(this.contentEl);
        };

        this.init();

        render(this.constructor.title, this.constructor.expandable);
    }

    init() {}

    click() {}
    
    expand() {
        this.titleEl.classList.add('active');
        this.titleEl.classList.remove('fred--hidden');
    }
    
    collapse() {
        this.titleEl.classList.remove('active');
        this.titleEl.classList.remove('fred--hidden');
    }
    
    hide() {
        this.titleEl.classList.remove('active');
        this.titleEl.classList.add('fred--hidden');
    }
    
    setContent(content) {
        if ((typeof content === 'object') && (content.outerHTML !== undefined)) {
            this.contentEl.innerHTML = '';
            this.contentEl.appendChild(content);
            return;
        }
        
        this.contentEl.innerHTML = content;
    }
    
    loading(text = '') {
        text = text || `Retrieving ${this.constructor.title}`;
        
        const wrapper = document.createElement('div');
        wrapper.classList.add('fred--loading_wrapper');
        wrapper.innerHTML = `<span class="fred--loading"></span> ${text}`;
        
        this.setContent(wrapper);
    }

    afterExpand() {}
}
