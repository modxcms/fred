import {button, div, input, select, span} from "./Elements";
import fredConfig from '../Config';
import promiseCancel from 'promise-cancel';
import fetch from 'isomorphic-fetch';
import emitter from "../EE";
import Choices from 'choices.js';

class Tagger {
    constructor(group) {
        this.group = group;

        this.inputToggle = null;
        this.inputWrapper = null;

        if (!fredConfig.pageSettings.tagger) fredConfig.pageSettings.tagger = {};
        if (!fredConfig.pageSettings.tagger[`tagger-${this.group.id}`]) fredConfig.pageSettings.tagger[`tagger-${this.group.id}`] = [];

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
                    field.appendChild(this.inputWrapper);
                } else {
                    return false;    
                }
                
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

        const addTag = button('Add', 'Add', 'fred--tagger_add_tag', () => {
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

                lastRequest = promiseCancel(fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=tagger-get-tags&query=${term}&group=${this.group.id}`));

                lastRequest.promise.then(response => {
                    return response.json();
                }).then(json => {
                    suggest(json.data.tags);
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

        const pageChoices = new Choices(selectField, {
            shouldSort:false,
            removeItemButton: false
        });
        
        if (defaultValue !== null) {
            pageChoices.setValue([defaultValue]);
        }

        pageChoices.ajax(callback => {
            fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=tagger-get-tags&group=${this.group.id}`)
                .then(response => {
                    return response.json()
                })
                .then(json => {
                    const tags = [];
                    json.data.tags.forEach(tag => {
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
            pageChoices.setChoices(options, 'value', 'label', true);
        };

        const serverLookup = () => {
            const query = pageChoices.input.value;
            if (query in lookupCache) {
                populateOptions(lookupCache[query]);
            } else {
                fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=tagger-get-tags&query=${query}&group=${this.group.id}`)
                    .then(response => {
                        return response.json()
                    })
                    .then(data => {
                        const tags = [];
                        data.data.tags.forEach(tag => {
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

        pageChoices.passedElement.addEventListener('search', event => {
            clearTimeout(lookupTimeout);
            lookupTimeout = setTimeout(serverLookup, 200);
        });

        pageChoices.passedElement.addEventListener('change', event => {
            if (tagsWrapper === null) {
                fredConfig.pageSettings.tagger[`tagger-${this.group.id}`] = [event.detail.value.trim()];
                pageChoices.setChoices(initData, 'value', 'label', true);
            } else {
                pageChoices.clearStore();
                pageChoices.setChoices(initData, 'value', 'label', true);
    
                this.onTagAdd(tagsWrapper, event.detail.value);
            }
        });
    }
    
    renderSingleSelectInput() {
        this.inputWrapper = div('fred--tagger_input_wrapper');
        let value = null;
        if (fredConfig.pageSettings.tagger[`tagger-${this.group.id}`].length > 0) {
            value = fredConfig.pageSettings.tagger[`tagger-${this.group.id}`][0];
        }
        
        this.renderSelectInput(null, value);
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

        if (this.group.allow_type === true) {
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
            
            if (~fredConfig.pageSettings.tagger[`tagger-${this.group.id}`].indexOf(tag)) {
                active = true;
            }

            tagsWrapper.appendChild(this.renderTag(tag, active, this.onTagToggle));
        });
    }

    renderTags(tagsWrapper) {
        fredConfig.pageSettings.tagger[`tagger-${this.group.id}`].forEach(tag => {
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

                if (~fredConfig.pageSettings.tagger[`tagger-${this.group.id}`].indexOf(tag)) {
                    return;
                }

                const tagEl = tagsWrapper.querySelector(`[data-tag="${tag}"]`);
                if (tagEl) {
                    tagEl.classList.add('fred--tagger_tag_active');
                    fredConfig.pageSettings.tagger[`tagger-${this.group.id}`].push(tag);
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

                fredConfig.pageSettings.tagger[`tagger-${this.group.id}`].push(tag);

                this.toggleInput();
            }
        });
    }

    toggleInput() {
        if (this.inputToggle && this.inputWrapper) {
            if (this.checkTagLimit()) {
                this.inputToggle.removeAttribute('hidden');
                this.inputToggle.classList.remove('fred--tagger_input_toggle_open');
            } else {
                this.inputToggle.setAttribute('hidden', 'hidden');
                this.inputWrapper.setAttribute('hidden', 'hidden');
                this.inputToggle.classList.remove('fred--tagger_input_toggle_open');
            }
        }
    }

    checkTagLimit() {
        return (this.group.tag_limit === 0) || (fredConfig.pageSettings.tagger[`tagger-${this.group.id}`].length < this.group.tag_limit);
    }

    autoComplete(options) {
        const addEvent = (el, type, handler) => {
            if (el.attachEvent) {
                el.attachEvent('on' + type, handler); 
            } else {
                el.addEventListener(type, handler);
            }
        };

        const removeEvent = (el, type, handler) => {
            if (el.detachEvent) {
                el.detachEvent('on' + type, handler);
            } else {
                el.removeEventListener(type, handler);
            }
        };

        const o = {
            selector: null,
            source: null,
            minChars: 3,
            delay: 150,
            offsetLeft: 0,
            offsetTop: 1,
            cache: 1,
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

        element.updateSC = (resize, next) => {
            const rect = element.getBoundingClientRect();
            // element.sc.style.left = Math.round(rect.left + (window.pageXOffset || document.documentElement.scrollLeft) + o.offsetLeft) + 'px';
            element.sc.style.left = '16px';
            // element.sc.style.top = Math.round(rect.bottom + (window.pageYOffset || document.documentElement.scrollTop) + o.offsetTop) + 'px';
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
                
                setTimeout(() => {
                    element.sc.style.display = 'none';
                }, 350);
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
                    next.className += ' fred--autocomplete_suggestion_selected';
                    element.value = next.getAttribute('data-val');
                } else {
                    next = (key === 40) ? sel.nextSibling : sel.previousSibling;
                    
                    if (next) {
                        sel.className = sel.className.replace('fred--autocomplete_suggestion_selected', '');
                        next.className += ' fred--autocomplete_suggestion_selected';
                        element.value = next.getAttribute('data-val');
                    } else {
                        sel.className = sel.className.replace('fred--autocomplete_suggestion_selected', '');
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
                    
                    setTimeout(function () {
                        // element.sc.style.display = 'none';
                    }, 20);
                }
            }
        };
        element.keyupHandler = e => {
            const key = window.event ? e.keyCode : e.which;
            if (!key || (key < 35 || key > 40) && key !== 13 && key !== 27) {
                const val = element.value;
                
                if (val.length >= o.minChars) {
                    if (val !== element.last_val) {
                        element.last_val = val;
                        clearTimeout(element.timer);
                        
                        if (o.cache) {
                            if (val in element.cache) {
                                suggest(element.cache[val]);
                                return;
                            }
                            
                            // no requests if previous suggestions were empty
                            for (let i = 1; i < val.length - o.minChars; i++) {
                                const part = val.slice(0, val.length - i);
                                if (part in element.cache && !element.cache[part].length) {
                                    suggest([]);
                                    return;
                                }
                            }
                        }

                        element.timer = setTimeout(() => {
                            o.source(val, suggest)
                        }, o.delay);
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
                suggestionItem.remove();
                // element.sc.style.display = 'none';
            });

            return suggestionItem;
        };
        
        const suggest = data => {
            const val = element.value;
            element.cache[val] = data;
            
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
        
        addEvent(window, 'resize', element.updateSC);
        addEvent(element, 'blur', element.blurHandler);
        addEvent(element, 'keydown', element.keydownHandler);
        addEvent(element, 'keyup', element.keyupHandler);
        if (!o.minChars) addEvent(element, 'focus', element.focusHandler);
        
        element.insertAdjacentElement('afterend', element.sc);

        // element.destroyAutoComplete = () => {
        //     removeEvent(window, 'resize', element.updateSC);
        //     removeEvent(element, 'blur', element.blurHandler);
        //     removeEvent(element, 'focus', element.focusHandler);
        //     removeEvent(element, 'keydown', element.keydownHandler);
        //     removeEvent(element, 'keyup', element.keyupHandler);
        //    
        //     if (element.autocompleteAttr) {
        //         element.setAttribute('autocomplete', element.autocompleteAttr);
        //     } else {
        //         element.removeAttribute('autocomplete');
        //     }
        //
        //     element.sc.remove();
        //     element.sc = null;
        // }
    }
}

export default Tagger;