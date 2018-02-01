import emitter from './EE';

export default class Topbar {
    constructor(wrapper) {
        wrapper.appendChild(this.buildTopBar());

        return this;
    }

    liWrapper(node) {
        const li = document.createElement('li');
        li.innerHTML = node.outerHTML;

        return li;
    }

    buildTopBar() {
        const topBar = document.createElement('div');
        topBar.classList.add('fred--topbar', 'fred--clearfix');

        const links = document.createElement('ul');
        links.classList.add('fred--topbar_links');

        const newPage = document.createElement('a');
        newPage.innerHTML = 'New Page <i class="fred--angle-down"></i>';

        const settings = document.createElement('a');
        settings.innerHTML = 'Settings <i class="fred--angle-down"></i>';

        links.appendChild(this.liWrapper(newPage));
        links.appendChild(this.liWrapper(settings));

        const buttons = document.createElement('div');
        buttons.classList.add('fred--topbar_buttons');

        const logout = document.createElement('button');
        logout.classList.add('fred--btn-small');
        logout.innerText = 'Logout';
        
        const save = document.createElement('button');
        save.classList.add('fred--btn-small');
        save.innerText = 'Save';
        save.addEventListener('click', e => {
            e.preventDefault();
            emitter.emit('fred-save');
        });

        buttons.appendChild(save);
        buttons.appendChild(logout);

        topBar.appendChild(links);
        topBar.appendChild(buttons);

        return topBar;
    }
}
