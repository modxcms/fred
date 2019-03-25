import ToolbarPlugin from "./ToolbarPlugin";
import {button} from "../../../../UI/Elements";

export default class RefreshElementCache extends ToolbarPlugin {
    static permission = 'fred_element_cache_refresh';
    
    render() {
        if (this.el.options.cacheOutput === true) {
            return button('', 'fred.fe.content.refresh_cache_element', ['fred--refresh_cache_element-icon'], this.el.render.bind(this.el, true));
        }
        
        return null;
    }
}