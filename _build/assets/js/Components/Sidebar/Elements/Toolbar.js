import { div, button } from "../../../UI/Elements";
//import MoveHandle from "./Toolbar/MoveHandle";
import ElementScreenshot from "./Toolbar/ElementScreenshot";
import PartialBlueprint from "./Toolbar/PartialBlueprint";
import ElementSettings from "./Toolbar/ElementSettings";
import Duplicate from "./Toolbar/Duplicate";
import Delete from "./Toolbar/Delete";
import Move from "./Toolbar/Move";
import fredConfig from "../../../Config";
import RefreshElementCache from "./Toolbar/RefreshElementCache";

export default class Toolbar {
    constructor(el) {
        this.el = el;
        this.invalidTheme = this.el.invalidTheme;
    }
    
    render() {
        const toolbar = div(['fred--toolbar']);
        const pluginWrapper = div(['fred--toolbar-plugins']);
        const pluginWrapperHide = div();
        const pluginToggle = button('', 'fred.fe.content.plugins', ['fred--element-settings'], () => {
            if(toolbar.contains(pluginWrapper)){
                toolbar.replaceChild(pluginWrapperHide, pluginWrapper);
            }else{
                toolbar.replaceChild(pluginWrapper, pluginWrapperHide);
            }
        });

        const plugins = [
            //MoveHandle,
            RefreshElementCache,
            ElementScreenshot,
            PartialBlueprint,
            ElementSettings,
            Duplicate,
            Delete,
            //Move
        ];

        let include = this.el.options.toolbarPluginsInclude;
        if (include && Array.isArray(include)) {
            include = include.map(item => item.toLowerCase());
        }
        
        let exclude = this.el.options.toolbarPluginsExclude;
        if (exclude && Array.isArray(exclude)) {
            exclude = exclude.map(item => item.toLowerCase());
        }
        
        for (let pluginName in fredConfig.toolbarPlugins) {
            if (!fredConfig.toolbarPlugins.hasOwnProperty(pluginName)) continue;

            if (include && Array.isArray(include)) {
                if (include.indexOf(pluginName.toLowerCase()) === -1) continue;
            } else if (exclude && Array.isArray(exclude)) {
                if (~exclude.indexOf(pluginName.toLowerCase())) continue;
            }
            
            plugins.push(fredConfig.toolbarPlugins[pluginName]);
        }

        plugins.forEach(plugin => {
            new plugin(this.el, pluginWrapper);
        });

        toolbar.appendChild(pluginWrapperHide);
        toolbar.appendChild(pluginToggle);
        new Move(this.el, toolbar);

        return toolbar;
        
    }
}