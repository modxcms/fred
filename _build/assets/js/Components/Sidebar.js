import emitter from '../EE';

export default class Sidebar {
    static title = 'TITLE NOT SET';
    static expandable = false;

    constructor(config = {}) {
        this.config = config || {};
        
        const render = (text, expandable = false) => {
            const dt = document.createElement('dt');
            dt.setAttribute('role', 'tab');
            dt.setAttribute('tabindex', '0');
            dt.innerHTML = ((expandable === true) ? text + '<i class="fred--angle-right fred--accordion_toggle"></i>' : '') + '</span>';

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
