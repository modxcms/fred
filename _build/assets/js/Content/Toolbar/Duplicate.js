import ToolbarPlugin from "./ToolbarPlugin";

export default class Duplicate extends ToolbarPlugin {
    static title = 'fred.fe.content.duplicate';
    static icon = 'fred--duplicate-icon';

    onClick() {
        this.el.duplicate.call(this.el);
    }
}
