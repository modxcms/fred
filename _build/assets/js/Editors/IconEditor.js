import Modal from '../Modal';

export default class IconEditor {
    constructor(i) {
        const wrapper = document.createElement('div');
        
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.value = i.className || '';

        const fields = [];

        if (i.dataset.fredAttrs) {
            const attrs = i.dataset.fredAttrs.split(',');
            attrs.forEach(attr => {
                const field = document.createElement('input');
                field.dataset.name = attr;
                field.setAttribute('type', 'text');
                field.value = i.getAttribute(attr || '');

                fields.push(field);
            });
        }

        wrapper.appendChild(this.labelWrapper(input, 'class'));
        
        fields.forEach(field => {
            wrapper.appendChild(this.labelWrapper(field, field.dataset.name));    
        });


        const modal = new Modal('Edit Icon', wrapper, () => {
            i.className = input.value;

            fields.forEach(field => {
                i.setAttribute(field.dataset.name, field.value);
            });
        });

        modal.render();
    }

    labelWrapper(input, name) {
        const label = document.createElement('label');
        label.innerText = name;
        
        label.appendChild(input);
        
        return label;
    }

}