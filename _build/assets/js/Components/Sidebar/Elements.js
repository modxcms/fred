import Sidebar from '../Sidebar';
import drake from '../../Drake';
import fetch from 'isomorphic-fetch';
import { div, dl, dt, dd, figure, img, figCaption } from './../../UI/Elements'
import emitter from "../../EE";

export default class Elements extends Sidebar {
    static title = 'fred.fe.elements';
    static icon = 'fred--sidebar_elements';
    static expandable = true;

    init() {
        this.content = null;
    }

    click() {
        if (this.content !== null) {
            return this.content;
        }

        return fetch(`${this.config.assetsUrl}endpoints/ajax.php?action=get-elements`)
            .then(response => {
                return response.json();
            })
            .then(response => {
                const content = dl();
                

                response.data.elements.forEach(category => {
                    const categoryTab = dt(category.category, [], (e, el) => {
                        const activeTabs = el.parentElement.querySelectorAll('dt.active');
                        
                        const isActive = el.classList.contains('active');
                        
                        for (let tab of activeTabs) {
                            tab.classList.remove('active');
                        }
                        
                        if (!isActive) {
                            el.classList.add('active');
                            e.stopPropagation();
                            emitter.emit('fred-sidebar-dt-active', categoryTab, categoryContent);
                        }
                    });
                    const categoryContent = dd();
                    const categoryEl = div(['fred--thumbs', 'source', 'blueprints-source']);
                    
                    category.elements.forEach(element => {
                        categoryEl.appendChild(Elements.elementWrapper(element.id, element.title, element.description, element.image, element.content, element.options || {}));
                    });

                    categoryContent.appendChild(categoryEl);

                    content.appendChild(categoryTab);
                    content.appendChild(categoryContent);
                });

                this.content = content;

                return this.content;
            });
    }

    static elementWrapper(id, title, description, image, content, options) {
        const element = figure(['fred--thumb']);

        const imageWrapper = div();
        const elementImage = img(image, title);

        imageWrapper.appendChild(elementImage);

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
