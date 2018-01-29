import emitter from '../EE';

export default class Sidebar {
    static title = 'TITLE NOT SET';
    static expandable = false;

    constructor() {
        const render = (text, expandable = false) => {
            const dt = document.createElement('dt');
            dt.setAttribute('role', 'tab');
            dt.setAttribute('tabindex', '0');
            dt.innerHTML = ((expandable === true) ? '<i class="fred--angle-left fred--accordion_toggle"></i>' : '') + text + '</span>';

            if (expandable === false) {
                dt.addEventListener('click', this.click);
            } else {
                dt.addEventListener('click', () => {
                    emitter.emit('fred-sidebar-expand', this, text, this.click());
                });
            }

            return dt;
        };

        this.init();

        return render(this.constructor.title, this.constructor.expandable);
    }

    init() {}

    click() {}

    afterExpand() {}
}
