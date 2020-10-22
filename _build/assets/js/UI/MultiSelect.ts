import {button, div, select, span} from "@fred/UI/Elements";
import {fixChoices} from "../Utils";
import {getTags} from "../Actions/tagger";
import emitter from "../EE";
import Choices from 'choices.js';

type Setting = {
    label?: string;
    name: string;
    tag_limit?: number;
};

type Tag = {
    value: string|number;
    label: string;
};

const MultiSelect = (setting: Setting, getData: (query?: string) => Promise<Tag[]>, onChange: (currentTags: Tag[]) => void) => {
    const currentTags: Tag[] = [];

    const renderSelectInput = () => {
        const selectField = select();

        inputWrapper.appendChild(selectField);

        let lookupTimeout = null;
        const lookupCache = {};
        let initData = [];

        const tagChoices = new Choices(selectField, {
            shouldSort:false,
            removeItemButton: false,
            searchResultLimit: 0
        }) as any;

        fixChoices(tagChoices);

        tagChoices._handleChoiceAction = function(activeItems, element) {
            if (!activeItems || !element) {
                return;
            }

            // If we are clicking on an option
            const id = element.getAttribute('data-id');
            const choice = this.store.getChoiceById(id);
            const passedKeyCode  = activeItems[0] && activeItems[0].keyCode ? activeItems[0].keyCode : null;
            const hasActiveDropdown = this.dropdown.classList.contains(this.config.classNames.activeState);

            // Update choice keyCode
            choice.keyCode = passedKeyCode;

            const event = new CustomEvent('choice', {
                detail: null,
                bubbles: true,
                cancelable: true
            });

            this.passedElement.dispatchEvent(event);

            if (choice && !choice.selected && !choice.disabled) {
                const canAddItem = this._canAddItem(activeItems, choice.value);

                if (canAddItem.response) {
                    this._addItem(
                        choice.value,
                        choice.label,
                        choice.id,
                        choice.groupId,
                        choice.customProperties,
                        choice.placeholder,
                        choice.keyCode
                    );
                    this._triggerChange(choice.value);
                }
            }
        };

        tagChoices.ajax(async callback => {
            try {
                const data = await getData();
                const tags = [];

                data.forEach(item => {
                    tags.push({
                        value: '' + item.value,
                        label: '' + item.label
                    });
                });

                initData = tags;
                callback(tags, 'value', 'label');

            } catch (error) {
                emitter.emit('fred-loading', error.message);
            }
        });

        const populateOptions = options => {
            tagChoices.setChoices(options, 'value', 'label', true);
        };

        const serverLookup = async () => {
            const query = tagChoices.input.value;
            if (query in lookupCache) {
                populateOptions(lookupCache[query]);
            } else {
                try {
                    const data = await getData(query);

                    const tags = [];
                    data.forEach(item => {
                        tags.push({
                            value: '' + item.value,
                            label: '' + item.label
                        });
                    });

                    lookupCache[query] = tags;
                    populateOptions(tags);

                } catch(error) {
                    emitter.emit('fred-loading', error.message);
                }
            }
        };

        tagChoices.passedElement.addEventListener('search', event => {
            clearTimeout(lookupTimeout);
            lookupTimeout = setTimeout(serverLookup, 200);
        });

        tagChoices.passedElement.addEventListener('change', event => {
            onTagAdd(event.target.textContent, event.detail.value);
        });

        tagChoices.passedElement.addEventListener('hideDropdown', event => {
            tagChoices.clearStore();
            tagChoices.clearInput();
            tagChoices.setChoices(initData, 'value', 'label', true);
        });
};
    const onTagAdd = (label, value) => {
        if (checkTagLimit()) {
            if (currentTags.find(el => el.value == value)) {
                return;
            }

            const tagEl = tagsWrapper.querySelector(`[data-tag="${value}"]`);
            if (tagEl) {
                tagEl.classList.add('fred--tagger_tag_active');
                currentTags.push({label, value});
                onChange(currentTags);
                toggleInput();

                return;
            }


            const tagToggle = renderTag(label, value, true, () => {
                onTagRemove(tagToggle, label, value);
            });

            tagsWrapper.appendChild(tagToggle);

            currentTags.push({label, value});
            onChange(currentTags);

            toggleInput();
        }
    }
    const checkTagLimit = () => {
        return !setting.tag_limit || (currentTags.length < setting.tag_limit);
    }
    const toggleInput = () => {
        if (checkTagLimit()) {
            if (inputToggle.classList.contains('fred--hidden')) {
                inputToggle.classList.remove('fred--tagger_input_toggle_open');
                inputToggle.classList.remove('fred--hidden');
            }
        } else {
            inputToggle.classList.add('fred--hidden');
            inputWrapper.classList.add('fred--hidden');
            inputToggle.classList.remove('fred--tagger_input_toggle_open');
        }
    }
    const renderTag = (label, tag, active = false, onClick: any = () => {}) => {
        const tagToggle = span('fred--tagger_tag', label);
        tagToggle.setAttribute('data-tag', tag);

        if (active) {
            tagToggle.classList.add('fred--tagger_tag_active');
        }

        if (typeof onClick === 'function') {
            tagToggle.addEventListener('click', e => {
                e.preventDefault();
                onClick(tagToggle, tag);
            });
        }

        return tagToggle;
    }
    const onTagRemove = (tagToggle, label, value) => {
        currentTags.splice(currentTags.findIndex(el => el.value == value), 1);
        onChange(currentTags);
        tagToggle.remove();
        toggleInput();
    }
    const renderTags = () => {
        currentTags.forEach(tag => {
            tagsWrapper.appendChild(renderTag(tag.label, tag.value, true, onTagRemove));
        });
    }

    const field = div('fred--tagger_field', div('fred--tagger_group_title', setting.label || setting.name));
    const tagsWrapper = div('fred--tagger_tags_wrapper');
    const inputWrapper = div(['fred--tagger_input_wrapper', 'fred--hidden']);
    const inputToggle = button('fred.fe.tagger.toggle_input', 'fred.fe.tagger.toggle_input', 'fred--tagger_input_toggle', () => {
        if (inputWrapper.classList.contains('fred--hidden')) {
            inputWrapper.classList.remove('fred--hidden');
            inputToggle.classList.add('fred--tagger_input_toggle_open');
        } else {
            inputWrapper.classList.add('fred--hidden');
            inputToggle.classList.remove('fred--tagger_input_toggle_open');
        }
    });

    renderSelectInput();
    renderTags();
    toggleInput();

    field.appendChild(inputToggle);
    field.appendChild(inputWrapper);
    field.appendChild(tagsWrapper);

    return field;

};

export default MultiSelect;
