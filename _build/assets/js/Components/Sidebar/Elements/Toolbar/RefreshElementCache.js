import ToolbarPlugin from "./ToolbarPlugin";
import {a} from "../../../../UI/Elements";

export default class RefreshElementCache extends ToolbarPlugin {
    static permission = 'fred_element_cache_refresh';
    
    render() {
        if (this.el.options.cacheOutput === true) {
            return a('fred.fe.content.refresh_cache_element', 'fred.fe.content.refresh_cache_element', '', [], this.el.render.bind(this.el, true));
        }
        
        return null;
    }
}