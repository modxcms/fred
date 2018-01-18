import emitter from './EE';
import ResourcesComponent from './Components/Sidebar/Resources';
import WidgetsComponent from './Components/Sidebar/Widgets';

export default class Sidebar {
    constructor(wrapper) {
        this.closeSidebar = this.closeSidebar.bind(this);
        wrapper.appendChild(this.buildOpenButton());
        wrapper.appendChild(this.buildSidebar());
        wrapper.appendChild(this.buildSidebar2());

        emitter.on('fred-expand', (title, icon, data) => {
            this.showSidebar2('<i class="fa fa-spinner fa-spin"></i> LOADING', 'LOADING');

            Promise.resolve(data).then(content => {
                this.showSidebar2('<i class="fa fa-' + icon + '"></i> ' + title, content);
            }).catch(err => {
                this.showSidebar2('<i class="fa fa-exclamation-triangle"></i> ERROR', 'SOMETHING WRONG HAPPENED');
            });
        });

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

        list.appendChild(new ResourcesComponent());
        list.appendChild(new WidgetsComponent());

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
        this.sidebar2Content.classList.add('fred--thumbs', 'source');

        items.appendChild(this.sidebar2Content);

        list.appendChild(this.sidebar2Header);
        list.appendChild(items);

        this.sidebar2.appendChild(list);

        return this.sidebar2;
    }

    buildOpenButton() {
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
}