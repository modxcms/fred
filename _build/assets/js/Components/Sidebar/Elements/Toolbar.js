import { div, button } from "../../../UI/Elements";
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
        this.pluginWrapper = div(['fred--toolbar-plugins', 'fred--hidden']);

        const pluginToggle = button('', 'fred.fe.content.settings', ['fred--element-settings'], () => {
            if (this.pluginWrapper.classList.contains('fred--hidden')) {
                this.showPlugins();
            } else {
                this.hidePlugins();
            }
        });

        const plugins = [
            RefreshElementCache,
            ElementScreenshot,
            PartialBlueprint,
            ElementSettings,
            Duplicate,
            Delete,
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
            new plugin(this.el, this.pluginWrapper);
        });

        toolbar.appendChild(this.pluginWrapper);
        toolbar.appendChild(pluginToggle);
        new Move(this.el, toolbar);

        window.addEventListener('scroll', e => {
            if(toolbar.getBoundingClientRect().top < 250){
                toolbar.classList.add('fred--toolbar-opendown');
            }else{
                toolbar.classList.remove('fred--toolbar-opendown');
            }
         });

        return toolbar;

    }

    showPlugins() {
        if (this.pluginWrapper) {
            this.pluginWrapper.classList.remove('fred--hidden');
        }
    }

    hidePlugins() {
        if (this.pluginWrapper) {
            this.pluginWrapper.classList.add('fred--hidden');
        }
    }
}
