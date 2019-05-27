import ToolbarPlugin from "./ToolbarPlugin";
import elementSettings from '../ElementSettings';
import fredConfig from "../../../../Config";

export default class ElementSettings extends ToolbarPlugin {
    static checkInvalidTheme = false;
    static title = 'fred.fe.content.settings';
    static icon = 'fred--element-settings';

    shouldRender() {
        if (this.el.options.settings && (this.el.options.settings.length > 0)) {
            return !((this.el.options.remote === true) && (this.el.options.cacheOutput === true) && !fredConfig.permission.fred_element_cache_refresh);
        }

        return false;
    }

    onClick() {
        elementSettings.open(this.el);
    }
}
