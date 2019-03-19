import ToolbarPlugin from "./ToolbarPlugin";
import { button } from "../../../../UI/Elements";
import partialBlueprints from "../PartialBlueprints";

export default class PartialBlueprint extends ToolbarPlugin {
    static permission = 'fred_blueprints_save';
    
    render() {
        return button('', 'fred.fe.content.partial_blueprint', ['fred--blueprint'], () => {partialBlueprints.open(this.el)});
    }
}