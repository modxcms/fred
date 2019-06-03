import fredConfig from "../../../../Config";
import { a } from "../../../../UI/Elements";

export default class ToolbarPlugin {
    static permission = null;
    static checkInvalidTheme = true;
    static title = 'TITLE NOT SET';
    static icon = '';

    constructor(el, toolbar) {
        this.el = el;
        this.toolbar = toolbar;

        if (this.constructor.permission && !fredConfig.permission[this.constructor.permission]) return;
        if (this.constructor.checkInvalidTheme && this.el.invalidTheme) return;

        const canRender = this.shouldRender();
        if (canRender === true) {
            const render = () => {
                if (this.customRender && (typeof this.customRender === 'function')) {
                    return this.customRender();
                } else {
                    return a(this.constructor.title, this.constructor.title, '',[], this.onClick.bind(this));
                }
            };

            const toolbarEl = render();
            if (toolbarEl) {
                this.toolbar.appendChild(toolbarEl);
            }
        }
    }

    shouldRender() {
        return true;
    }

    onClick() {}
}
