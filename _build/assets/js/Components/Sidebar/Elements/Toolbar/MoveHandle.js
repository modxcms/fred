import ToolbarPlugin from "./ToolbarPlugin";
import {div} from "../../../../UI/Elements";

export default class MoveHandle extends ToolbarPlugin {
    static permission = 'fred_element_move';
    
    render() {
        this.toolbar.classList.add('handle');
        
        return div(['fred--toolbar-grip', 'handle']);
    }
}