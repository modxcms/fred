import emitter from './EE';
import ResourcesComponent from './Components/Sidebar/Resources';
import WidgetsComponent from './Components/Sidebar/Widgets';
import promiseCancel from 'promise-cancel';

export default class Sidebar {
    constructor(config = {}) {
        this.lastRequest = null;
        this.config = config || {};

        emitter.on('fred-sidebar-expand', (cmp, title, data) => {
            this.showSidebar2('<span class="fred--loading">LOADING</span>', '<span class="fred--loading"></span>');

            this.lastRequest = promiseCancel(Promise.resolve(data));
            this.lastRequest.promise.then(content => {
                this.lastRequest = null;
                this.showSidebar2(title, content);
                cmp.afterExpand();
            }).catch(err => {
                this.lastRequest = null;

                if (err.type === 'cancel') {
                    return;
                }

                this.showSidebar2('ERROR', 'SOMETHING WRONG HAPPENED');
            });
        });

        emitter.on('fred-sidebar-hide', () => {
            this.hideSidebar();
        });

        emitter.on('fred-sidebar-show', () => {
            this.showSidebar();
        });
    }

    render(wrapper) {
        this.wrapper = document.createElement('div');

        this.closeSidebar = this.closeSidebar.bind(this);
        this.wrapper.appendChild(this.buildOpenButton());
        this.wrapper.appendChild(this.buildSidebar());
        this.wrapper.appendChild(this.buildSidebar2());

        wrapper.appendChild(this.wrapper);

        return this;
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
                if (this.lastRequest !== null) {
                    this.lastRequest.cancel();
                    this.lastRequest = null;
                }
                this.sidebar.setAttribute('hidden', 'hidden');
                window.removeEventListener('click', this.closeSidebar);
            } else {
                if (this.lastRequest !== null) {
                    this.lastRequest.cancel();
                    this.lastRequest = null;
                }
                this.sidebar2.setAttribute('hidden', 'hidden');
            }
        });

        const header = document.createElement('div');
        header.classList.add('fred--sidebar_title');
        header.innerHTML = '<img src="' + (this.config.assetsUrl || '') + 'images/modx-revo-icon-48.svg" alt="MODX FRED" class="fred--logo"><h1>Fred</h1>';

        const list = document.createElement('dl');
        list.classList.add('fred--accordion');
        list.setAttribute('tabindex', '0');
        list.setAttribute('role', 'tablist');

        list.appendChild(new ResourcesComponent(this.config));
        list.appendChild(new WidgetsComponent(this.config));

        this.sidebar.appendChild(this.close);
        this.sidebar.appendChild(header);
        this.sidebar.appendChild(list);

        return this.sidebar;
    }

    showSidebar2(title, content) {
        this.sidebar2Header.innerHTML = '<span>' + title + '</span>';
        this.sidebar2Content.innerHTML = content;
        this.sidebar2.removeAttribute('hidden');
    }

    buildSidebar2() {
        this.sidebar2 = document.createElement('div');
        this.sidebar2.classList.add('fred--sidebar_paneltwo', 'active');
        this.sidebar2.setAttribute('hidden', 'hidden');

        const list = document.createElement('dl');
        list.classList.add('fred--accordion');
        list.setAttribute('tabindex', '0');
        list.setAttribute('role', 'tablist');

        this.sidebar2Header = document.createElement('dt');
        this.sidebar2Header.classList.add('active');
        this.sidebar2Header.setAttribute('role', 'tab');
        this.sidebar2Header.setAttribute('tabindex', '0');

        const items = document.createElement('dd');
        items.setAttribute('role', 'tab');
        items.setAttribute('tabindex', '0');

        this.sidebar2Content = document.createElement('div');

        items.appendChild(this.sidebar2Content);

        list.appendChild(this.sidebar2Header);
        list.appendChild(items);

        this.sidebar2.appendChild(list);

        return this.sidebar2;
    }

    buildOpenButton() {
        this.open = document.createElement('button');
        this.open.classList.add('fred--open');
        this.open.innerHTML = '<i class="fred--angle-right"></i> <i class="fred--angle-right"></i>';

        this.open.addEventListener('click', e => {
            e.preventDefault();
            this.sidebar.removeAttribute('hidden');
            window.addEventListener('click', this.closeSidebar);
        });

        return this.open;
    }

    closeSidebar(e) {
        e.preventDefault();

        if (this.lastRequest !== null) {
            this.lastRequest.cancel();
            this.lastRequest = null;
        }

        this.sidebar.setAttribute('hidden', 'hidden');
        this.sidebar2.setAttribute('hidden', 'hidden');

        window.removeEventListener('click', this.closeSidebar);
    }

    hideSidebar() {
        this.wrapper.setAttribute('hidden', 'hidden');
    }

    showSidebar() {
        this.wrapper.removeAttribute('hidden');
    }
}
