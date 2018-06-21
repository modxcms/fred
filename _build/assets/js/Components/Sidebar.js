import emitter from '../EE';
import fredConfig from './../Config';
import { div, span, dt } from '../UI/Elements';

export default class Sidebar {
    static title = 'TITLE NOT SET';
    static icon = '';
    static expandable = false;

    constructor(sidebarWrapper) {
        this.sidebarWrapper = sidebarWrapper;
        this.fredConfig = fredConfig;
        this.config = fredConfig.config;
        this.titleEl = null;
        this.contentEl = null;
        
        const render = (text, expandable = false) => {
            this.titleEl = dt(text);

            if (this.constructor.icon) {
                this.titleEl.classList.add(this.constructor.icon);
            }

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
    }
    
    collapse() {
        this.titleEl.classList.remove('active');
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
        text = text || `Retrieving ${fredConfig.lng(this.constructor.title)}`;
        
        const wrapper = div('fred--loading_wrapper', [
            span('fred--loading'),
            text
        ]);
        
        this.setContent(wrapper);
    }

    afterExpand() {}
}
