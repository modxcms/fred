import {button, div, input, span} from "./Elements";
import fredConfig from '../Config';

class Tagger {
    constructor(group) {
        this.group = group;

        this.inputToggle = null;
        this.inputWrapper = null;

        if (!fredConfig.pageSettings.tagger) fredConfig.pageSettings.tagger = {};
        if (!fredConfig.pageSettings.tagger[`tagger-${this.group.id}`]) fredConfig.pageSettings.tagger[`tagger-${this.group.id}`] = [];
    }

    render() {
        console.log(this.group);
        if (this.group.field_type !== 'tagger-field-tags') return false;

        const field = div('fred--tagger_field', div('fred--tagger_group_title', this.group.name));
        const tagsWrapper = div('fred--tagger_tags_wrapper');

        if (this.group.hide_input === false) {
            this.renderInput(tagsWrapper);
            field.appendChild(this.inputToggle);
            field.appendChild(this.inputWrapper);
        }

        if (this.group.show_autotag) {
            this.renderAutoTag(tagsWrapper);
        } else {
            this.renderTags(tagsWrapper);
        }

        this.toggleInput();

        field.appendChild(tagsWrapper);

        return field;
    }

    renderInput(tagsWrapper) {
        this.inputWrapper = div('fred--tagger_input_wrapper');
        this.inputWrapper.setAttribute('hidden', 'hidden');

        this.inputToggle = button('+', '+', 'fred--tagger_input_toggle', () => {
            if (this.inputWrapper.getAttribute('hidden')) {
                this.inputWrapper.removeAttribute('hidden');
                this.inputToggle.classList.add('fred--tagger_input_toggle_open');
            } else {
                this.inputWrapper.setAttribute('hidden', 'hidden');
                this.inputToggle.classList.remove('fred--tagger_input_toggle_open');
            }
        });

        const inputField = input('', 'text', 'fred--tagger_input');

        inputField.addEventListener('keyup', e => {
            if (e.keyCode === 188) {
                this.onTagAdd(tagsWrapper, inputField);
            }
        });

        const addTag = button('Add', 'Add', 'fred--tagger_add_tag', () => {
            this.onTagAdd(tagsWrapper, inputField);
        });

        this.inputWrapper.appendChild(inputField);
        this.inputWrapper.appendChild(addTag);
    }

    renderAutoTag(tagsWrapper) {
        this.group.tags.forEach(tag => {
            const tagToggle = span('fred--tagger_tag', tag);

            if (fredConfig.pageSettings.tagger[`tagger-${this.group.id}`].indexOf(tag) !== -1) {
                tagToggle.classList.add('fred--tagger_tag_active');
            }

            tagToggle.addEventListener('click', e => {
                e.preventDefault();
                this.onTagToggle(tagToggle, tag);
            });

            tagsWrapper.appendChild(tagToggle);
        });
    }

    renderTags(tagsWrapper) {
        fredConfig.pageSettings.tagger[`tagger-${this.group.id}`].forEach(tag => {
            const tagToggle = span(['fred--tagger_tag', 'fred--tagger_tag_active'], tag);

            tagToggle.addEventListener('click', e => {
                e.preventDefault();
                this.onTagRemove(tagToggle, tag);
            });

            tagsWrapper.appendChild(tagToggle);
        });
    }

    onTagToggle(tagToggle, tag) {
        if (this.group.as_radio === true) {
            const isActive = tagToggle.classList.contains('fred--tagger_tag_active');

            const activeTags = tagToggle.parentElement.querySelectorAll('.fred--tagger_tag_active');
            for (let activeTag of activeTags) {
                activeTag.classList.remove('fred--tagger_tag_active');
            }

            if (isActive) {
                tagToggle.classList.remove('fred--tagger_tag_active');
                fredConfig.pageSettings.tagger[`tagger-${this.group.id}`] = [];
            } else {
                tagToggle.classList.add('fred--tagger_tag_active');
                fredConfig.pageSettings.tagger[`tagger-${this.group.id}`] = [tag];
            }

            return;
        }

        if (tagToggle.classList.contains('fred--tagger_tag_active')) {
            tagToggle.classList.remove('fred--tagger_tag_active');

            fredConfig.pageSettings.tagger[`tagger-${this.group.id}`].splice(fredConfig.pageSettings.tagger[`tagger-${this.group.id}`].indexOf(tag), 1);

            this.toggleInput();
        } else {
            if (this.checkTagLimit()) {
                tagToggle.classList.add('fred--tagger_tag_active');

                fredConfig.pageSettings.tagger[`tagger-${this.group.id}`].push(tag);
            }

            this.toggleInput();
        }
    }

    onTagRemove(tagToggle, tag) {
        fredConfig.pageSettings.tagger[`tagger-${this.group.id}`].splice(fredConfig.pageSettings.tagger[`tagger-${this.group.id}`].indexOf(tag), 1);
        tagToggle.remove();
        this.toggleInput();
    }

    onTagAdd(tagsWrapper, inputField) {
        const tags = inputField.value.trim().split(',');

        tags.forEach(tag => {
            if (this.checkTagLimit()) {
                tag = tag.trim();
                if (!tag) return;

                const tagToggle = span(['fred--tagger_tag', 'fred--tagger_tag_active'], tag);

                tagToggle.addEventListener('click', e => {
                    e.preventDefault();
                    if (this.group.show_autotag) {
                        this.onTagToggle(tagToggle, tag);
                    } else {
                        this.onTagRemove(tagToggle, tag);
                    }
                });

                tagsWrapper.appendChild(tagToggle);

                fredConfig.pageSettings.tagger[`tagger-${this.group.id}`].push(tag);

                this.toggleInput();
            }
        });

        inputField.value = '';
    }

    toggleInput() {
        if (this.inputToggle && this.inputWrapper) {
            if (this.checkTagLimit()) {
                this.inputToggle.removeAttribute('hidden');
            } else {
                this.inputToggle.setAttribute('hidden', 'hidden');
                this.inputWrapper.setAttribute('hidden', 'hidden');
            }
        }
    }

    checkTagLimit() {
        return (this.group.tag_limit === 0) || (fredConfig.pageSettings.tagger[`tagger-${this.group.id}`].length < this.group.tag_limit);
    }
}

export default Tagger;