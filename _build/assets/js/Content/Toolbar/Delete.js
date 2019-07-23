import ToolbarPlugin from "./ToolbarPlugin";

export default class Delete extends ToolbarPlugin {
    static permission = 'fred_element_front_end_delete';
    static checkInvalidTheme = false;
    static title = 'fred.fe.content.delete';
    static icon = 'fred--trash';

    onClick() {
        this.el.remove.call(this.el);
    }
}
