import emitter from '../EE';

export default class Sidebar {
    static title = 'TITLE NOT SET';
    static icon = 'modx';
    static expandable = false;

    constructor() {
        const render = (text, icon, expandable = false) => {
            const dt = document.createElement('dt');
            dt.setAttribute('role', 'tab');
            dt.setAttribute('tabindex', '0');
            dt.innerHTML = ((expandable === true) ? '<i class="angle-left fred--accordion_toggle"></i>' : '') + '<span><i class="fa fa-' + icon + '"></i> ' + text + '</span>'

            if (expandable === false) {
                dt.addEventListener('click', this.click);
            } else {
                dt.addEventListener('click', () => {
                    emitter.emit('fred-sidebar-expand', this, text, icon, this.click());
                });
            }

            return dt;
        };

        this.init();

        return render(this.constructor.title, this.constructor.icon, this.constructor.expandable);
    }

    init() {}

    click() {}

    afterExpand() {}
}
