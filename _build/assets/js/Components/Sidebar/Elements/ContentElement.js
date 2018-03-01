import drake from '../../../drake';
import imageEditor from '../../../Editors/ImageEditor';

export class ContentElement {
    constructor(el) {
        this.el = el;
        this.wrapper = this.render();
    }
    
    render() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('fred--block');
        wrapper.fredWrapper = this;

        const toolbar = document.createElement('div');
        toolbar.classList.add('fred--toolbar');

        const moveHandle = document.createElement('button');
        moveHandle.classList.add('fred--move-icon', 'handle');

        const duplicate = document.createElement('button');
        duplicate.classList.add('fred--duplicate-icon');
        duplicate.addEventListener('click', e => {
            e.preventDefault();

            this.duplicate();
        });

        const trashHandle = document.createElement('button');
        trashHandle.classList.add('fred--trash');
        trashHandle.addEventListener('click', e => {
            e.preventDefault();
            wrapper.remove();
        });

        toolbar.appendChild(moveHandle);

        toolbar.appendChild(duplicate);
        toolbar.appendChild(trashHandle);

        wrapper.appendChild(toolbar);

        const content = document.createElement('div');
        content.classList.add('fred--block_content');
        content.dataset.fredElementId = this.el.dataset.fredElementId;

        content.innerHTML = this.el.innerHTML;

        content.querySelectorAll('img[contenteditable="true"]').forEach(img => {
            img.addEventListener('click', e => {
                e.preventDefault();
                imageEditor.edit(img);
            })
        });

        wrapper.appendChild(content);

        return wrapper;
    }

    reRender() {
        const children = this.wrapper.querySelector('.fred--block_content').children;
        for (let item of children) {

            const block = item.querySelector('.fred--block');

            if (block) {
                const siblings = [];

                let sibling = block.nextSibling;

                while (sibling) {
                    if (sibling.classList.contains('fred--block')) {
                        siblings.push(sibling);
                    }

                    sibling = sibling.nextSibling;
                }
                
                const blockContent = new ContentElement(block.querySelector('.fred--block_content'));

                blockContent.reRender();

                block.replaceWith(blockContent.wrapper);

                siblings.forEach(nextItem => {
                    const siblingContent = new ContentElement(nextItem.querySelector('.fred--block_content'));

                    siblingContent.reRender();

                    nextItem.replaceWith(siblingContent.wrapper);
                });
            }
        }
    }
    
    duplicate() {
        const clone = new ContentElement(this.wrapper.querySelector('.fred--block_content').cloneNode(true));

        clone.reRender();

        if (this.wrapper.nextSibling === null) {
            this.wrapper.parentNode.appendChild(clone.wrapper);
        } else {
            this.wrapper.parentNode.insertBefore(clone.wrapper, this.wrapper.nextSibling);
        }

        drake.reloadContainers();
        
        return true;
    }
}

export default ContentElement;