import ToolbarPlugin from "./ToolbarPlugin";
import elementSettings from '../ElementSettings';
import { button } from "../../../../UI/Elements";

export default class ElementSettings extends ToolbarPlugin {
    static checkInvalidTheme = false;
    
    render() {
        if (this.el.options.settings && (this.el.options.settings.length > 0)) {
            return button('', 'fred.fe.content.settings', ['fred--element-settings'], () => {elementSettings.open(this)});
        }
        
        return null;
    }
}