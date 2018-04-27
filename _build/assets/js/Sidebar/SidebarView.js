import fredConfig from './../Config';
import { div, button, img, h1, dl, i } from './../UI/Elements';

/**
 * @param components
 * @param onComponentAdd
 * @param onClose
 */
export default (components, onComponentAdd, onClose) => {
    const buildComponents = () => {
        const sidebar = dl('fred--accordion');

        components.forEach(component => {
            const addedComponent = new component(sidebar);
            onComponentAdd(addedComponent);
        });
        
        return sidebar;
    };
    
    const wrapper = div(['fred--sidebar', 'fred--hidden'], [
        button([i('fred--angle-left'), i('fred--angle-left')], ['fred--sidebar_close'], onClose),
        div('fred--sidebar_title', [
            img(`${fredConfig.config.assetsUrl || ''}images/modx-revo-icon-48.svg`, 'MODX FRED', 'fred--logo'),
            h1('Fred')
        ])
    ]);
    
    wrapper.appendChild(buildComponents());
    wrapper.setAttribute('aria-hidden', 'true');

    return wrapper;
};