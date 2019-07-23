import ToolbarPlugin from "./ToolbarPlugin";
import MoveHandle from "./MoveHandle";
import {button, div} from "../../UI/Elements";
import fredConfig from "../../Config";

export default class Move extends ToolbarPlugin {
    static permission = 'fred_element_move';

    customRender() {
        const positionGroup = div(['fred--position-group']);

        const moveUp = button('', 'fred.fe.content.move_up', ['fred--position-up'], this.moveUp.bind(this));
        const moveDown = button('', 'fred.fe.content.move_down', ['fred--position-down'], this.moveDown.bind(this));

        positionGroup.appendChild(moveUp);
        new MoveHandle(this.el, positionGroup);
        positionGroup.appendChild(moveDown);

        return positionGroup;
    }

    moveDown() {
        if (!fredConfig.permission.fred_element_move) return;

        this.el.dropzone.moveElementDown(this.el);
    }

    moveUp() {
        if (!fredConfig.permission.fred_element_move) return;

        this.el.dropzone.moveElementUp(this.el);
    }
}
