import fredConfig from '@fred/Config';
import { div, img, h1, dl, button } from '../UI/Elements';

type VoidFn = () => void;

let wrapper;
export const render = (components: any[], onComponentAdd: (component) => void, onClose: VoidFn, onSave: VoidFn, onPreview: VoidFn) => {
    const buildComponents = () => {
        const sidebar = dl('fred--accordion');

        components.forEach(component => {
            const addedComponent = new component(sidebar);
            onComponentAdd(addedComponent);
        });

        return sidebar;
    };

    const logo = img(`${fredConfig.config.assetsUrl || ''}images/modx-revo-icon-48.svg`, 'MODX FRED', 'fred--logo');

    if (!fredConfig.config.forceSidebar) {
        logo.setAttribute('title', fredConfig.lng('fred.fe.close_sidebar'));
        logo.addEventListener('click', e => {
            e.preventDefault();
            onClose();
        });
    }

    wrapper = div(['fred--sidebar'], [
        div('fred--sidebar_title', [
            logo,
            h1('Fred')
        ])
    ]);

    wrapper.appendChild(buildComponents());

    const buttongroup = div(['fred--sidebar_button-group']);
    buttongroup.appendChild(button('', 'fred.fe.toggle_preview', ['fred--btn-sidebar', 'fred--btn-sidebar_preview'], onPreview));

    if (!fredConfig.config.forceSidebar) {
        buttongroup.appendChild(button('', 'fred.fe.close_sidebar', ['fred--btn-sidebar', 'fred--btn-sidebar_close'], onClose));
    }

    if (fredConfig.permission.save_document) {
        buttongroup.appendChild(button('', 'fred.fe.save', ['fred--btn-sidebar', 'fred--btn-sidebar_save'], onSave));
    }

    wrapper.appendChild(buttongroup);

    if (!fredConfig.config.forceSidebar && !fredConfig.config.sidebarOpen) {
        hide();
    }

    return wrapper;
};

export const show = () => {
    wrapper.classList.remove('fred--hidden');
    wrapper.setAttribute('aria-hidden', 'false');
};

export const hide = () => {
    wrapper.classList.add('fred--hidden');
    wrapper.setAttribute('aria-hidden', 'true');
};

export const isVisible = () => {
    return !wrapper.classList.contains('fred--hidden')
};

export default {
    render,
    show,
    hide,
    isVisible
};
