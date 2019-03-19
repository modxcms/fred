import ToolbarPlugin from "./ToolbarPlugin";
import {button} from "../../../../UI/Elements";

export default class Duplicate extends ToolbarPlugin {
    render() {
        return button('', 'fred.fe.content.duplicate', ['fred--duplicate-icon'], this.el.duplicate.bind(this.el));
    }
}