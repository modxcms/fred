import ToolbarPlugin from "./ToolbarPlugin";
import {a} from "../../../../UI/Elements";

export default class Delete extends ToolbarPlugin {
    static permission = 'fred_element_front_end_delete';
    static checkInvalidTheme = false;

    render() {
        return a('fred.fe.content.delete','fred.fe.content.delete', '', [], this.el.remove.bind(this.el));
    }
}
