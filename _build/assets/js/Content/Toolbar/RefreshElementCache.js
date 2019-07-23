import ToolbarPlugin from "./ToolbarPlugin";

export default class RefreshElementCache extends ToolbarPlugin {
    static permission = 'fred_element_cache_refresh';
    static title = 'fred.fe.content.refresh_cache_element';
    static icon = 'fred--refresh_cache_element-icon';

    shouldRender() {
        return this.el.options.cacheOutput === true;
    }

    onClick() {
        this.el.render.call(this.el, true);
    }
}
