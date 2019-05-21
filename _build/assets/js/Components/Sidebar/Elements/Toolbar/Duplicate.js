import ToolbarPlugin from "./ToolbarPlugin";
import {a} from "../../../../UI/Elements";

export default class Duplicate extends ToolbarPlugin {
    render() {
        return a('fred.fe.content.duplicate', 'fred.fe.content.duplicate', '', [], this.el.duplicate.bind(this.el));
    }
}