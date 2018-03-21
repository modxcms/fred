import Sidebar from '../Sidebar';
import drake from '../../Drake';
import fetch from 'isomorphic-fetch';

export default class Elements extends Sidebar {
    static title = 'Elements';
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
                const content = document.createElement('dl');
                

                response.data.elements.forEach(category => {
                    const dt = document.createElement('dt');
                    dt.setAttribute('role', 'tab');
                    dt.setAttribute('tabindex', '1');
                    dt.innerHTML = category.category;
                    
                    const dd = document.createElement('dd');
                    
                    const categoryEl = document.createElement('div');
                    categoryEl.classList.add('fred--thumbs', 'source', 'blueprints-source');
                    
                    category.elements.forEach(element => {
                        categoryEl.appendChild(Elements.elementWrapper(element.id, element.title, element.description, element.image, element.content, element.options || {}));
                    });

                    dd.appendChild(categoryEl);

                    content.appendChild(dt);
                    content.appendChild(dd);
                });

                this.content = content;

                return this.content;
            });
    }

    static elementWrapper(id, title, description, image, content, options) {
        const figure = document.createElement('figure');
        figure.classList.add('fred--thumb');

        const div = document.createElement('div');
        const img = document.createElement('img');
        img.src = image;
        img.alt = title;

        div.appendChild(img);

        const figCaption = document.createElement('figcaption');
        figCaption.innerHTML = `<strong>${title}</strong><em>${description}</em>`;

        const chunk = document.createElement('div');
        chunk.classList.add('chunk');
        chunk.dataset.fredElementId = id;
        chunk.setAttribute('hidden', 'hidden');
        chunk.innerHTML = content;
        chunk.elementOptions = options;

        figure.appendChild(div);
        figure.appendChild(figCaption);
        figure.appendChild(chunk);
        
        return figure;
    }

    afterExpand() {
        drake.reloadContainers();
    }
}
