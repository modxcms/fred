import SidebarPlugin from '../../SidebarPlugin';
import drake from '../../../Drake';
import { div, dl, dt, dd, figure, h3, img, figCaption } from './../../../UI/Elements'
import emitter from "../../../EE";
import hoverintent from 'hoverintent';
import { getElements } from '../../../Actions/elements';

export default class Elements extends SidebarPlugin {
    static title = 'fred.fe.elements';
    static icon = 'fred--sidebar_elements';
    static expandable = true;

    click() {
        return getElements()
            .then(data => {
                const content = dl();

                data.elements.forEach(category => {
                    const categoryTab = dt(category.category, [], (e, el) => {
                        const activeTabs = el.parentElement.querySelectorAll('dt.active');
                        
                        const isActive = el.classList.contains('active');
                        
                        for (let tab of activeTabs) {
                            if(tab === el) continue;
                            tab.classList.remove('active');
                        }
                        
                        if (!isActive) {
                            el.classList.add('active');
                            e.stopPropagation();
                            emitter.emit('fred-sidebar-dt-active', categoryTab, categoryContent);
                        }
                    });
                    
                    const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
                    
                    if(!isSafari){
                        hoverintent(categoryTab,
                            function(e){
                                let el = e.target;
                                const activeTabs = el.parentElement.querySelectorAll('dt.active');
    
                                const isActive = el.classList.contains('active');
    
                                for (let tab of activeTabs) {
                                    if(tab === el) continue;
                                    tab.classList.remove('active');
                                }
    
                                if (!isActive) {
                                    el.classList.add('active');
                                    emitter.emit('fred-sidebar-dt-active', categoryTab, categoryContent);
                                }
                            },
                            function(e){
    
                            }
                        );
                    }
                    //@TODO May need fallback for click on safari

                    const categoryContent = dd();
                    const categoryEl = div(['fred--thumbs', 'source', 'elements-source']);
                    const categoryHeader = h3(category.category);
                    
                    category.elements.forEach(element => {
                        categoryEl.appendChild(Elements.elementWrapper(element.id, element.title, element.description, element.image, element.content, element.options || {}));
                    });

                    categoryContent.appendChild(categoryHeader);
                    categoryContent.appendChild(categoryEl);

                    content.appendChild(categoryTab);
                    content.appendChild(categoryContent);
                });

                return content;
            });
    }

    static elementWrapper(id, title, description, image, content, options) {
        const element = figure(['fred--thumb']);

        const imageWrapper = div();
        const elementImage = img(image, title);

        imageWrapper.appendChild(elementImage);

        if (fredConfig.lngExists(title)) {
            title = fredConfig.lng(title);
        } 

        if (fredConfig.lngExists(description)) {
            description = fredConfig.lng(description);
        } 
        
        const caption = figCaption(`<strong>${title}</strong><em>${description}</em>`);

        const chunk = div(['chunk']);
        chunk.dataset.fredElementId = id;
        chunk.dataset.fredElementTitle = title;
        chunk.setAttribute('hidden', 'hidden');
        chunk.elementMarkup = content;
        chunk.elementOptions = options;

        element.appendChild(imageWrapper);
        element.appendChild(caption);
        element.appendChild(chunk);
        
        return element;
    }

    afterExpand() {
        drake.reloadContainers();
    }
}
