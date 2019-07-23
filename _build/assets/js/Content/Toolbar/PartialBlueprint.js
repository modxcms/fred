import ToolbarPlugin from "./ToolbarPlugin";
import partialBlueprints from "../PartialBlueprints";

export default class PartialBlueprint extends ToolbarPlugin {
    static permission = 'fred_blueprints_save';
    static title = 'fred.fe.content.partial_blueprint';
    static icon = 'fred--blueprint';

    onClick() {
        partialBlueprints.open(this.el);
    }
}
