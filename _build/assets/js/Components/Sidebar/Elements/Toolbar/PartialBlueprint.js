import ToolbarPlugin from "./ToolbarPlugin";
import { a } from "../../../../UI/Elements";
import partialBlueprints from "../PartialBlueprints";

export default class PartialBlueprint extends ToolbarPlugin {
    static permission = 'fred_blueprints_save';
    
    render() {
        return a( 'fred.fe.content.partial_blueprint', 'fred.fe.content.partial_blueprint', '',[], () => {partialBlueprints.open(this.el)});
    }
}