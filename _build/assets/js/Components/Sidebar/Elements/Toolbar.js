import { div } from "../../../UI/Elements";
import MoveHandle from "./Toolbar/MoveHandle";
import ElementScreenshot from "./Toolbar/ElementScreenshot";
import PartialBlueprint from "./Toolbar/PartialBlueprint";
import ElementSettings from "./Toolbar/ElementSettings";
import Duplicate from "./Toolbar/Duplicate";
import Delete from "./Toolbar/Delete";
import Move from "./Toolbar/Move";

export default class Toolbar {
    constructor(el) {
        this.el = el;
        this.invalidTheme = this.el.invalidTheme;
    }
    
    render() {
        const toolbar = div(['fred--toolbar']);

        const plugins = [
            MoveHandle,
            ElementScreenshot,
            PartialBlueprint,
            ElementSettings,
            Duplicate,
            Delete,
            Move
        ];

        plugins.forEach(plugin => {
            new plugin(this.el, toolbar);
        });
       
        return toolbar;
        
    }
}