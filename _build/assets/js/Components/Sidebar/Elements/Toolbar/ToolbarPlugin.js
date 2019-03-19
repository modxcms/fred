import fredConfig from "../../../../Config";

export default class ToolbarPlugin {
    static permission = null;
    static checkInvalidTheme = true;
    
    constructor(el, toolbar) {
        this.el = el;
        this.toolbar = toolbar;
        
        if (this.constructor.permission && !fredConfig.permission[this.constructor.permission]) return;
        if (this.constructor.checkInvalidTheme && this.el.invalidTheme) return;
        
        const toolbarEl = this.render();
        if (toolbarEl) {
            this.toolbar.appendChild(toolbarEl);
        }
    }
    
    render(toolbar) {}
}