import ElementSettings from "./ElementSettings";
import {button} from "../../UI/Elements";

export default class ElementSettingsButton extends ElementSettings
{
    customRender() {
        return button('','',['fred--element-edit', 'edit'], this.onClick.bind(this));
    }
}
