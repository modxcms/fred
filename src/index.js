import emitter from './EE';
import dragula from 'dragula';

export default class Fred {
    constructor(config = {}) {
        this.closeSidebar = this.closeSidebar.bind(this);
        this.init();
    }
    
    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('fred');

        this.wrapper.addEventListener('click', e => {
            e.stopPropagation();
        });

        this.wrapper.appendChild(this.buildOpenButton());
        this.wrapper.appendChild(this.buildTopBar());
        this.wrapper.appendChild(this.buildSidebar());
        this.wrapper.appendChild(this.buildSidebar2());
        
        if (document.body.firstChild === null) {
            document.body.appendChild(this.wrapper);
        } else {
            document.body.insertBefore(this.wrapper, document.body.firstChild);
        }
    }
    
    liWrapper (node) {
        const li = document.createElement('li');
        li.innerHTML = node.outerHTML;
        
        return li;
    }
    
    buildSidebar() {
        this.sidebar = document.createElement('div');
        this.sidebar.classList.add('fred--sidebar');
        this.sidebar.setAttribute('hidden', 'hidden');

        this.close = document.createElement('button');
        this.close.classList.add('fred--sidebar_close');
        this.close.innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="-4 -4 20 20" enable-background="new -4 -4 20 20" xml:space="preserve"><polygon points="16.079,-0.666 12.717,-4.027 6.052,2.637 -0.613,-4.027 -3.975,-0.666 2.69,6 -3.975,12.664 -0.612,16.026 6.052,9.362 12.717,16.027 16.079,12.664 9.414,6 "></polygon></svg>';
        this.close.addEventListener('click', e => {
            e.preventDefault();
            if (this.sidebar2.hasAttribute('hidden') === true) {
                this.sidebar.setAttribute('hidden', 'hidden');
                window.removeEventListener('click', this.closeSidebar);
            } else {
                this.sidebar2.setAttribute('hidden', 'hidden');
            }
        });
        
        const header = document.createElement('div');
        header.classList.add('fred--sidebar_title');
        header.innerHTML = '<img src="images/modx-revo-icon-48.svg" alt="MODX FRED" class="fred--logo"><h1>Fred</h1>';

        const list = document.createElement('dl');
        list.classList.add('fred--accordion');
        list.setAttribute('tabindex', '0');
        list.setAttribute('role', 'tablist');
        
        const dtWrapper = (text, icon, expandable = false, onClick = () => {}) => {
            const dt = document.createElement('dt');
            dt.setAttribute('role', 'tab');
            dt.setAttribute('tabindex', '0');
            dt.innerHTML = ((expandable === true) ? '<i class="fa fa-angle-left fred--accordion_toggle"></i>' : '') + '<span><i class="fa fa-' + icon + '"></i> ' + text + '</span>'
            dt.addEventListener('click', onClick);
            
            return dt;
        };

        list.appendChild(dtWrapper('Resources', 'file-o', false));
        
        list.appendChild(dtWrapper('Layouts', 'television', true, () => {
            this.sidebar2.removeAttribute('hidden');
        }));
        
        list.appendChild(dtWrapper('Components', 'vcard-o', false));
        
        this.sidebar.appendChild(this.close);
        this.sidebar.appendChild(header);
        this.sidebar.appendChild(list);
        
        return this.sidebar;
    }

    buildSidebar2() {
        this.sidebar2 = document.createElement('div');
        this.sidebar2.classList.add('fred--sidebar_paneltwo', 'active');
        this.sidebar2.setAttribute('hidden', 'hidden');

        const list = document.createElement('dl');
        list.classList.add('fred--accordion');
        list.setAttribute('tabindex', '0');
        list.setAttribute('role', 'tablist');
        
        const header = document.createElement('dt');
        header.classList.add('active');
        header.setAttribute('role', 'tab');
        header.setAttribute('tabindex', '0');

        const title = '<i class="fa fa-television"></i> Layouts';
        header.innerHTML = '<span>' + title + '</span>';
        
        const items = document.createElement('dd');
        items.setAttribute('role', 'tab');
        items.setAttribute('tabindex', '0');

        const content = document.createElement('div');
        content.classList.add('fred--thumbs', 'source');

        content.innerHTML = '<figure class="fred--thumb">\n' +
            '                            <div><img src="layouts/full-width.svg" alt=""></div>\n' +
            '                            <figcaption>\n' +
            '                                <strong>Full Width</strong>\n' +
            '                            </figcaption>\n' +
            '                            <div class="chunk" hidden="hidden">\n' +
            '                                <h2>Header #2</h2>\n' +
            '                                <p>Description</p>\n' +
            '                            </div>\n' +
            '                        </figure>\n' +
            '                        <figure class="fred--thumb">\n' +
            '                            <div><img src="layouts/right-panel-layout.svg" alt=""></div>\n' +
            '                            <figcaption>\n' +
            '                                <strong>2 Column</strong>\n' +
            '                                <em>Content Left. Component Right.</em>\n' +
            '                            </figcaption>\n' +
            '                            <div class="chunk" hidden="hidden">\n' +
            '                                <h3>Header #3</h3>\n' +
            '                                <img src="http://via.placeholder.com/350x150" />\n' +
            '                                <p>Description</p>\n' +
            '                            </div>\n' +
            '                        </figure>\n' +
            '                        <figure class="fred--thumb">\n' +
            '                            <div><img src="layouts/four-grid.svg" alt=""></div>\n' +
            '                            <figcaption>\n' +
            '                                <strong>Grid</strong>\n' +
            '                            </figcaption>\n' +
            '                            <div class="chunk" hidden="hidden">\n' +
            '                                <p>Description Only</p>\n' +
            '                            </div>\n' +
            '                        </figure>';

        items.appendChild(content);

        list.appendChild(header);
        list.appendChild(items);

        this.sidebar2.appendChild(list);

        return this.sidebar2;
    }
    
    buildOpenButton () {
        this.open = document.createElement('button');
        this.open.classList.add('fred--open');
        this.open.innerHTML = '<i class="fa fa-angle-right"></i> <i class="fa fa-angle-right"></i>';
        
        this.open.addEventListener('click', e => {
            e.preventDefault();
            this.sidebar.removeAttribute('hidden');
            window.addEventListener('click', this.closeSidebar);
        });
        
        return this.open;
    }
    
    closeSidebar(e) {
        e.preventDefault();
        this.sidebar.setAttribute('hidden', 'hidden');
        this.sidebar2.setAttribute('hidden', 'hidden');

        window.removeEventListener('click', this.closeSidebar);
    }
    
    buildTopBar() {
        const topBar = document.createElement('div');
        topBar.classList.add('fred--topbar', 'fred--clearfix');

        const links = document.createElement('ul');
        links.classList.add('fred--topbar_links');

        const newPage = document.createElement('a');
        newPage.innerHTML = 'New Page <i class="fa fa-angle-down"></i>';
        
        const settings = document.createElement('a');
        settings.innerHTML = 'Settings <i class="fa fa-angle-down"></i>';
        
        links.appendChild(this.liWrapper(newPage));
        links.appendChild(this.liWrapper(settings));
        
        const buttons = document.createElement('div');
        buttons.classList.add('fred--topbar_buttons');

        const logout = document.createElement('button');
        logout.classList.add('fred--btn-small');
        logout.innerText = 'Logout';
        
        buttons.appendChild(logout);
        
        topBar.appendChild(links);
        topBar.appendChild(buttons);
        
        return topBar;
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