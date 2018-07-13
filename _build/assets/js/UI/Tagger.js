import { button, div, input, select, span } from "./Elements";
import fredConfig from '../Config';
import promiseCancel from 'promise-cancel';
import emitter from "../EE";
import Choices from 'choices.js';
import { fixChoices } from "../Utils";
import { getTags } from '../Actions/tagger';

class Tagger {
    constructor(group, currentTags = null, onChange = () => {}) {
        this.group = group;

        this.inputToggle = null;
        this.inputWrapper = null;

        if (currentTags === null) {
            if (!fredConfig.pageSettings.tagger) fredConfig.pageSettings.tagger = {};
            if (!fredConfig.pageSettings.tagger[`tagger-${this.group.id}`]) fredConfig.pageSettings.tagger[`tagger-${this.group.id}`] = [];

            currentTags = fredConfig.pageSettings.tagger[`tagger-${this.group.id}`];
        }
        
        this.currentTags = currentTags;
        this.onChange = onChange.bind(this);
        
        this.onTagToggle = this.onTagToggle.bind(this);
        this.onTagRemove = this.onTagRemove.bind(this);
    }

    render() {
        const field = div('fred--tagger_field', div('fred--tagger_group_title', this.group.name));

        switch (this.group.field_type) {
            case 'tagger-field-tags' :
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
                break;
            case 'tagger-combo-tag':
                if (this.group.allow_new === false) {
                    this.renderSingleSelectInput();
                } else {
                    this.renderSingleTagInput();
                }
                
                field.appendChild(this.inputWrapper);
                
                break;
            default:
                return false;
                
        }
        
        return field;
    }
    
    renderTagInput(tagsWrapper) {
        const inputField = input('', 'text', 'fred--tagger_input');

        inputField.addEventListener('keyup', e => {
            if ((e.keyCode === 188) || (e.keyCode === 13)) {
                this.onTagSubmit(tagsWrapper, inputField);
            }
        });

        inputField.addEventListener('keydown', e => {
            if (e.keyCode === 13) {
                e.preventDefault();
            }
        });

        const addTag = button('fred.fe.tagger.add', 'fred.fe.tagger.add', 'fred--tagger_add_tag', () => {
            this.onTagSubmit(tagsWrapper, inputField);
        });

        this.inputWrapper.appendChild(inputField);
        this.inputWrapper.appendChild(addTag);

        let lastRequest = null;

        this.autoComplete({
            selector: inputField,
            onSelect: (e, term, item) => {
                this.onTagSubmit(tagsWrapper, inputField);
            },
            source: (term, suggest) => {
                if (lastRequest !== null) {
                    lastRequest.cancel();
                    lastRequest = null;
                }

                lastRequest = promiseCancel(getTags(this.group.id, term));

                lastRequest.promise.then(tags => {
                    suggest(tags);
                })
            }
        });
    }

    renderSelectInput(tagsWrapper = null, defaultValue = null) {
        const selectField = select();

        this.inputWrapper.appendChild(selectField);

        let lookupTimeout = null;
        const lookupCache = {};
        let initData = [];

        const tagChoices = new Choices(selectField, {
            shouldSort:false,
            removeItemButton: false,
            searchResultLimit: 0
        });

        fixChoices(tagChoices);
        
        if (tagsWrapper !== null) {
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
    
                // this.clearInput();
    
                // We wont to close the dropdown if we are dealing with a single select box
                if (hasActiveDropdown && this.isSelectOneElement) {
                    // this.hideDropdown();
                    // this.containerOuter.focus();
                }
            };
        }
        
        if (defaultValue !== null) {
            tagChoices.setValue([defaultValue]);
        }

        tagChoices.ajax(callback => {
            getTags(this.group.id)
                .then(data => {
                    const tags = [];
                    data.forEach(tag => {
                        tags.push({
                            value: '' + tag,
                            label: '' + tag
                        });
                    });
                    
                    initData = tags;
                    callback(tags, 'value', 'label');
                })
                .catch(error => {
                    emitter.emit('fred-loading', error.message);
                });
        });

        const populateOptions = options => {
            tagChoices.setChoices(options, 'value', 'label', true);
        };

        const serverLookup = () => {
            const query = tagChoices.input.value;
            if (query in lookupCache) {
                populateOptions(lookupCache[query]);
            } else {
                getTags(this.group.id, query)
                    .then(data => {
                        const tags = [];
                        data.forEach(tag => {
                            tags.push({
                                value: '' + tag,
                                label: '' + tag
                            });
                        });
                        
                        lookupCache[query] = tags;
                        populateOptions(tags);
                    })
                    .catch(error => {
                        emitter.emit('fred-loading', error.message);
                    });
            }
        };

        tagChoices.passedElement.addEventListener('search', event => {
            clearTimeout(lookupTimeout);
            lookupTimeout = setTimeout(serverLookup, 200);
        });

        tagChoices.passedElement.addEventListener('change', event => {
            if (tagsWrapper === null) {
                this.currentTags = [event.detail.value.trim()];
                this.onChange(this.currentTags);
                tagChoices.setChoices(initData, 'value', 'label', true);
            } else {
                this.onTagAdd(tagsWrapper, event.detail.value);
            }
        });

        if (tagsWrapper !== null) {
            tagChoices.passedElement.addEventListener('hideDropdown', event => {
                tagChoices.clearStore();
                tagChoices.clearInput();
                tagChoices.setChoices(initData, 'value', 'label', true);
            });
        }
    }
    
    renderSingleSelectInput() {
        this.inputWrapper = div('fred--tagger_input_wrapper');
        let value = null;
        if (this.currentTags.length > 0) {
            value = this.currentTags[0];
        }
        
        this.renderSelectInput(null, value);
    }
    
    renderSingleTagInput() {
        this.inputWrapper = div('fred--tagger_input_wrapper');
        
        const inputField = input('', 'text', 'fred--tagger_input');

        if (this.currentTags.length > 0) {
            inputField.value = this.currentTags[0];
        }

        inputField.addEventListener('keydown', e => {
            if (e.keyCode === 13) {
                e.preventDefault();
            }
        });
        
        inputField.addEventListener('keyup', e => {
            this.currentTags = [inputField.value.trim()];
            this.onChange(this.currentTags);
        });

        const showList = button('fred.fe.tagger.toggle_list', 'fred.fe.tagger.toggle_list', 'fred--tagger_open_list', () => {
            if (showList.listVisible) {
                inputField.blur();
            } else {
                inputField.openList(inputField.value, 0);
                inputField.focus();     
            }
        });

        showList.addEventListener('mousedown', e => {
            showList.listVisible = (inputField.sc.style.display === 'block'); 
        });

        this.inputWrapper.appendChild(inputField);
        this.inputWrapper.appendChild(showList);

        let lastRequest = null;

        this.autoComplete({
            hideOnSelect: true,
            selector: inputField,
            onSelect: (e, term, item) => {
                this.currentTags = [inputField.value.trim()];
                this.onChange(this.currentTags);
            },
            source: (term, suggest) => {
                if (lastRequest !== null) {
                    lastRequest.cancel();
                    lastRequest = null;
                }

                lastRequest = promiseCancel(getTags(this.group.id, term));

                lastRequest.promise.then(tags => {
                    suggest(tags);
                })
            }
        });
    }
    
    renderInput(tagsWrapper) {
        this.inputWrapper = div(['fred--tagger_input_wrapper', 'fred--hidden']);

        this.inputToggle = button('fred.fe.tagger.toggle_input', 'fred.fe.tagger.toggle_input', 'fred--tagger_input_toggle', () => {
            if (this.inputWrapper.classList.contains('fred--hidden')) {
                this.inputWrapper.classList.remove('fred--hidden');
                this.inputToggle.classList.add('fred--tagger_input_toggle_open');
            } else {
                this.inputWrapper.classList.add('fred--hidden');
                this.inputToggle.classList.remove('fred--tagger_input_toggle_open');
            }
        });

        if (this.group.allow_new === true) {
            this.renderTagInput(tagsWrapper);
        } else {
            this.renderSelectInput(tagsWrapper);
        }
    }
    
    renderTag(tag, active = false, onClick = () => {}) {
        const tagToggle = span('fred--tagger_tag', tag);
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

    renderAutoTag(tagsWrapper) {
        this.group.tags.forEach(tag => {
            let active = false;
            
            if (~this.currentTags.indexOf(tag)) {
                active = true;
            }

            tagsWrapper.appendChild(this.renderTag(tag, active, this.onTagToggle));
        });
    }

    renderTags(tagsWrapper) {
        this.currentTags.forEach(tag => {
            tagsWrapper.appendChild(this.renderTag(tag, true, this.onTagRemove));
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
                this.currentTags = [];
            } else {
                tagToggle.classList.add('fred--tagger_tag_active');
                this.currentTags = [tag];
            }
            
            this.onChange(this.currentTags);

            return;
        }

        if (tagToggle.classList.contains('fred--tagger_tag_active')) {
            tagToggle.classList.remove('fred--tagger_tag_active');

            this.currentTags.splice(this.currentTags.indexOf(tag), 1);

            this.toggleInput();
        } else {
            if (this.checkTagLimit()) {
                tagToggle.classList.add('fred--tagger_tag_active');

                this.currentTags.push(tag);
            }

            this.toggleInput();
        }

        this.onChange(this.currentTags);
    }

    onTagRemove(tagToggle, tag) {
        this.currentTags.splice(this.currentTags.indexOf(tag), 1);
        this.onChange(this.currentTags);
        tagToggle.remove();
        this.toggleInput();
    }

    onTagSubmit(tagsWrapper, inputField) {
        this.onTagAdd(tagsWrapper, inputField.value);

        inputField.value = '';
    }
    
    onTagAdd(tagsWrapper, tagsString) {
        const tags = tagsString.trim().split(',');
        
        tags.forEach(tag => {
            if (this.checkTagLimit()) {
                tag = tag.trim();
                if (!tag) return;

                if (~this.currentTags.indexOf(tag)) {
                    return;
                }

                const tagEl = tagsWrapper.querySelector(`[data-tag="${tag}"]`);
                if (tagEl) {
                    tagEl.classList.add('fred--tagger_tag_active');
                    this.currentTags.push(tag);
                    this.onChange(this.currentTags);
                    this.toggleInput();

                    return;
                }


                const tagToggle = this.renderTag(tag, true, () => {
                    if (this.group.show_autotag) {
                        this.onTagToggle(tagToggle, tag);
                    } else {
                        this.onTagRemove(tagToggle, tag);
                    }
                });

                tagsWrapper.appendChild(tagToggle);

                this.currentTags.push(tag);
                this.onChange(this.currentTags);

                this.toggleInput();
            }
        });
    }

    toggleInput() {
        if (this.inputToggle && this.inputWrapper) {
            if (this.checkTagLimit()) {
                if (this.inputToggle.classList.contains('fred--hidden')) {
                    this.inputToggle.classList.remove('fred--tagger_input_toggle_open');
                    this.inputToggle.classList.remove('fred--hidden');
                }
            } else {
                this.inputToggle.classList.add('fred--hidden');
                this.inputWrapper.classList.add('fred--hidden');
                this.inputToggle.classList.remove('fred--tagger_input_toggle_open');
            }
        }
    }

    checkTagLimit() {
        return (this.group.tag_limit === 0) || (this.currentTags.length < this.group.tag_limit);
    }

    autoComplete(options) {
        const o = {
            selector: null,
            source: null,
            minChars: 0,
            delay: 150,
            offsetLeft: 0,
            offsetTop: 1,
            cache: 1,
            hideOnSelect: false,
            onSelect: (e, term, item) => {}
        };
        
        for (let k in options) {
            if (options.hasOwnProperty(k)) o[k] = options[k];
        }

        // init
        if (typeof o.selector !== 'object') return;
        const element = o.selector;

        element.sc = div(['fred--autocomplete_suggestions']);
        element.autocompleteAttr = element.getAttribute('autocomplete');
        element.setAttribute('autocomplete', 'off');
        
        element.cache = {};
        element.last_val = '';

        element.openList = (val, delay) => {
            element.last_val = val;
            clearTimeout(element.timer);

            if (o.cache) {
                if (val in element.cache) {
                    suggest(element.cache[val], val, false);
                    return;
                }

                // no requests if previous suggestions were empty
                for (let i = 1; i < val.length - o.minChars; i++) {
                    const part = val.slice(0, val.length - i);
                    if (part in element.cache && !element.cache[part].length) {
                        suggest([], '', false);
                        return;
                    }
                }
            }

            if (delay > 0) {
                element.timer = setTimeout(() => {
                    o.source(val, data => {
                        suggest(data, val);
                    });
                }, delay);
            } else {
                o.source(val, data => {
                    suggest(data, val);
                });
            }
        };
        
        element.updateSC = (resize, next) => {
            const rect = element.getBoundingClientRect();
            element.sc.style.width = Math.round(rect.right - rect.left) + 'px'; // outerWidth
            
            if (!resize) {
                element.sc.style.display = 'block';
                if (!element.sc.maxHeight) {
                    element.sc.maxHeight = parseInt((window.getComputedStyle ? getComputedStyle(element.sc, null) : element.sc.currentStyle).maxHeight);
                }
                
                if (!element.sc.suggestionHeight) {
                    element.sc.suggestionHeight = element.sc.querySelector('.fred--autocomplete_suggestion').offsetHeight;
                }
                
                if (element.sc.suggestionHeight) {
                    if (!next) {
                        element.sc.scrollTop = 0;
                    } else {
                        const scrTop = element.sc.scrollTop;
                        const selTop = next.getBoundingClientRect().top - element.sc.getBoundingClientRect().top;
                        
                        if (selTop + element.sc.suggestionHeight - element.sc.maxHeight > 0) {
                            element.sc.scrollTop = selTop + element.sc.suggestionHeight + scrTop - element.sc.maxHeight;
                        } else if (selTop < 0) {
                            element.sc.scrollTop = selTop + scrTop;
                        }
                    }
                }
            }
        };
        element.blurHandler = () => {
            let over_sb = false;
            
            try {
                over_sb = element.parentNode.querySelector('.fred--autocomplete_suggestions:hover');
            } catch (e) {
                over_sb = false;
            }
            
            if (!over_sb) {
                element.last_val = element.value;
                element.sc.style.display = 'none';
                
                // setTimeout(() => {
                //     element.sc.style.display = 'none';
                // }, 350);
            } else if (element !== document.activeElement) {
                setTimeout(function () {
                    element.focus();
                }, 20);
            }
        };
        element.keydownHandler = e => {
            const key = window.event ? e.keyCode : e.which;
            // down (40), up (38)
            if ((key === 40 || key === 38) && element.sc.innerHTML) {
                let next;
                let sel = element.sc.querySelector('.fred--autocomplete_suggestion.fred--autocomplete_suggestion_selected');
                
                if (!sel) {
                    next = (key === 40) ? element.sc.querySelector('.fred--autocomplete_suggestion') : element.sc.childNodes[element.sc.childNodes.length - 1]; // first : last
                    next.classList.add('fred--autocomplete_suggestion_selected');
                    element.value = next.getAttribute('data-val');
                } else {
                    next = (key === 40) ? sel.nextSibling : sel.previousSibling;
                    
                    if (next) {
                        sel.classList.remove('fred--autocomplete_suggestion_selected');
                        next.classList.add('fred--autocomplete_suggestion_selected');
                        element.value = next.getAttribute('data-val');
                    } else {
                        sel.classList.remove('fred--autocomplete_suggestion_selected');
                        element.value = element.last_val;
                        next = 0;
                    }
                }
                element.updateSC(0, next);
                
                return false;
            } else if (key === 27) { // esc
                element.value = element.last_val;
                element.sc.style.display = 'none';
            } else if (key === 13 || key === 9) { // enter
                let sel = element.sc.querySelector('.fred--autocomplete_suggestion.fred--autocomplete_suggestion_selected');
                if (sel && element.sc.style.display !== 'none') {
                    o.onSelect(e, sel.getAttribute('data-val'), sel);
                    
                    if (o.hideOnSelect === true) {
                        setTimeout(function () {
                            element.sc.style.display = 'none';
                        }, 20);
                    }
                }
            }
        };
        element.keyupHandler = e => {
            const key = window.event ? e.keyCode : e.which;
            if (!key || (key < 35 || key > 40) && key !== 13 && key !== 27) {
                const val = element.value;
                
                if (val.length >= o.minChars) {
                    if (val !== element.last_val) {
                        element.openList(val, o.delay);
                    }
                } else {
                    element.last_val = val;
                    element.sc.style.display = 'none';
                }
            }
        };
        element.focusHandler = e => {
            element.last_val = '\n';
            element.keyupHandler(e)
        };

        const renderItem = (item, search) => {
            search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");

            const suggestionItem = div('fred--autocomplete_suggestion', item.replace(re, "<b>$1</b>"));
            suggestionItem.setAttribute('data-val', item);

            suggestionItem.addEventListener('mouseover', e => {
                suggestionItem.classList.add('fred--autocomplete_suggestion_selected');
            });
            
            suggestionItem.addEventListener('mouseleave', e => {
                const selectedItems = suggestionItem.parentElement.querySelectorAll('.fred--autocomplete_suggestion_selected');
                for (let item of selectedItems) {
                    item.classList.remove('fred--autocomplete_suggestion_selected');   
                }
            });
            
            suggestionItem.addEventListener('mousedown', e => {
                const value = suggestionItem.getAttribute('data-val');
                element.value = value;
                o.onSelect(e, value, suggestionItem);

                if (o.hideOnSelect === true) {
                    element.sc.style.display = 'none';
                }
            });

            return suggestionItem;
        };
        
        const suggest = (data, val, cache = true) => {
            if (cache === true) {
                element.cache[val] = data;
            }
            
            if (data.length && val.length >= o.minChars) {
                element.sc.innerHTML = '';
                
                for (let i = 0; i < data.length; i++) {
                    element.sc.appendChild(renderItem(data[i], val));
                }

                element.updateSC(0);
            } else {
                element.sc.style.display = 'none';
            }
        };
        
        window.addEventListener('resize', element.updateSC);
        element.addEventListener('blur', element.blurHandler);
        element.addEventListener('keydown', element.keydownHandler);
        element.addEventListener('keyup', element.keyupHandler);
        
        element.insertAdjacentElement('afterend', element.sc);
    }
}

export default Tagger;