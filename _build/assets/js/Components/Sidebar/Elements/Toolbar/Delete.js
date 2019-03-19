import ToolbarPlugin from "./ToolbarPlugin";
import {button} from "../../../../UI/Elements";

export default class Delete extends ToolbarPlugin {
    static permission = 'fred_element_delete';
    static checkInvalidTheme = false;
    
    render() {
        return button('', 'fred.fe.content.delete', ['fred--trash'], this.el.remove.bind(this.el));
    }
}