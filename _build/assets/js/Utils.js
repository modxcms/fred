import {div} from "./UI/Elements";
import Element from "./Content/Element";
import fredConfig from './Config';
import ui from './UI';
import emitter from './EE';
import Modal from "./Modal";
import fetch from "./Fetch";
import utilitySidebar from "./Components/UtilitySidebar";
import actions from './Actions';
import Mousetrap from 'mousetrap';
import Choices from 'choices.js';
import flatpickr from "flatpickr";
import ColorPicker from './ColorPicker/ColorPicker';
import noUiSlider from 'nouislider';
import hoverintent from 'hoverintent';
import Finder from './Finder';
import {cloneDeep} from "lodash";

export const debounce = (delay, fn) => {
    let timerId;

    return function (...args) {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            fn(...args);
            timerId = null;
        }, delay);
    };
};

export const errorHandler = response => {
    if ((response.status >= 200) && (response.status < 300)) {
        return response.json();
    }

    return response.json().then(json => {
        const err = new Error(json.message);
        err.response = json;

        throw err;
    })
};

export const applyScripts = async wrapper => {
    return new Promise(resolve => {
        const scriptsToReplace = [];

        const doReplace = index => {
            const next = index + 1;

            if (scriptsToReplace[index].new.src) {
                scriptsToReplace[index].new.addEventListener('load', () => {
                    if (scriptsToReplace[next]) {
                        doReplace(next);
                    } else {
                        resolve();
                    }
                });

                scriptsToReplace[index].old.parentElement.replaceChild(scriptsToReplace[index].new, scriptsToReplace[index].old);
                return;
            }

            scriptsToReplace[index].old.parentElement.replaceChild(scriptsToReplace[index].new, scriptsToReplace[index].old);

            if (scriptsToReplace[next]) {
                doReplace(next);
            } else {
                resolve();
            }
        };

        const scripts = wrapper.querySelectorAll('script-fred');
        for (let script of scripts) {
            const newScript = document.createElement('script');

            for (let i = 0; i < script.attributes.length; i++) {
                newScript.setAttribute(script.attributes[i].name, script.attributes[i].value);
            }

            if (script.dataset.fredScript) {
                newScript.innerHTML = script.dataset.fredScript;
            }

            newScript.removeAttribute('data-fred-script');

            scriptsToReplace.push({old: script, 'new': newScript});
        }

        if (scriptsToReplace[0]) {
            doReplace(0);
        }
    });
};

export const replaceScripts = wrapper => {
    const scripts = wrapper.querySelectorAll('script');

    for (let script of scripts) {
        const newScript = document.createElement('script-fred');

        for (let i = 0; i < script.attributes.length; i++) {
            newScript.setAttribute(script.attributes[i].name, script.attributes[i].value);
        }

        newScript.dataset.fredScript = script.innerHTML;

        script.parentElement.replaceChild(newScript, script);
    }
};

export const fixChoices = choices => {
    const sortByScore = (a, b) => {
        return a.score - b.score;
    };

    choices.renderChoices = function(choices, fragment, withinGroup = false) {
        // Create a fragment to store our list items (so we don't have to update the DOM for each item)
        const choicesFragment = fragment || document.createDocumentFragment();
        const { renderSelectedChoices, searchResultLimit, renderChoiceLimit } = this.config;
        const filter = this.isSearching ? sortByScore : this.config.sortFilter;
        const appendChoice = (choice) => {
            const shouldRender = renderSelectedChoices === 'auto' ?
                (this.isSelectOneElement || !choice.selected) :
                true;
            if (shouldRender) {
                const dropdownItem = this._getTemplate('choice', choice);
                choicesFragment.appendChild(dropdownItem);
            }
        };

        let rendererableChoices = choices;

        if (renderSelectedChoices === 'auto' && !this.isSelectOneElement) {
            rendererableChoices = choices.filter(choice => !choice.selected);
        }

        // Split array into placeholders and "normal" choices
        const { placeholderChoices, normalChoices } = rendererableChoices.reduce((acc, choice) => {
            if (choice.placeholder) {
                acc.placeholderChoices.push(choice);
            } else {
                acc.normalChoices.push(choice);
            }
            return acc;
        }, { placeholderChoices: [], normalChoices: [] });

        // If sorting is enabled or the user is searching, filter choices
        if (this.config.shouldSort || this.isSearching) {
            normalChoices.sort(filter);
        }

        let choiceLimit = rendererableChoices.length;

        // Prepend placeholeder
        const sortedChoices = [...placeholderChoices, ...normalChoices];

        if (this.isSearching) {
            if (searchResultLimit > 0) {
                choiceLimit = searchResultLimit;
            }
        } else if (renderChoiceLimit > 0 && !withinGroup) {
            choiceLimit = renderChoiceLimit;
        }

        // Add each choice to dropdown within range
        for (let i = 0; i < choiceLimit; i++) {
            if (sortedChoices[i]) {
                appendChoice(sortedChoices[i]);
            }
        }

        return choicesFragment;
    };

    choices.ajax = function(fn) {
        if (this.initialised === true) {
            if (this.isSelectElement) {
                // Show loading text
                requestAnimationFrame(() => {
                    this._handleLoadingState(true);

                    fn(this._ajaxCallback());
                });
            }
        }
        return this;
    }
};

export const loadElements = async (data, fireEvents = false) => {
    const zones = data.data;
    const dzPromises = [];

    for (let zoneName in zones) {
        if (zones.hasOwnProperty(zoneName)) {
            const zoneEl = document.querySelector(`[data-fred-dropzone="${zoneName}"]`);
            if (zoneEl && zoneEl.dropzone) {
                dzPromises.push(zoneEl.dropzone.loadElements(zones[zoneName], data.elements, null, true, fireEvents));
            }
        }
    }

    return Promise.all(dzPromises);
};

export const buildBlueprint = (data, dropzone, before) => {
    const complete = data.complete || false;
    let emptyPage = true;

    for (let dz of fredConfig.fred.dropzones) {
        if (dz.el.querySelector('.fred--block')) {
            emptyPage = false;
            break;
        }
    }

    let elements = [];

    if (complete === false) {
        elements = data.data;
    } else {
        if (emptyPage === true) {
            return loadElements(data, true).then(() => {
                applyScripts(document.body)
            });
        }

        let dzName = '';

        if (data.data[dropzone.name]) {
            dzName = dropzone.name;
        } else if (data.data['content']) {
            dzName = 'content';
        }

        if (dzName === '') {
            console.error('Something wrong happened with blueprint.');
            return;
        }

        elements = data.data[dzName];
    }

    return dropzone.loadElements(elements, data.elements, before, false, true).then(wrappers => {
        wrappers.forEach(wrapper => {
            applyScripts(wrapper);
        })
    });
};

export const getTemplateSettings = (cleanRender = false) => {
    const pageSettings = cloneDeep(fredConfig.pageSettings);
    delete pageSettings['tvs'];
    for (let tv in fredConfig.pageSettings['tvs']) {
        if (!pageSettings.hasOwnProperty('tv_' + tv)) {
            pageSettings['tv_' + tv] = valueParser(fredConfig.pageSettings['tvs'][tv], cleanRender);
        }
    }
    return {
        ...pageSettings,
        theme_dir: '{{theme_dir}}',
        template: {
            theme_dir: cleanRender ? `[[++${fredConfig.config.themeSettingsPrefix}.theme_dir]]` : fredConfig.config.themeDir
        },
    };
};

export const valueParser = (value, clean = false) => {
    if (typeof value !== 'string') return value;

    if (clean === true) {
        value = value.replace('{{theme_dir}}', `[[++${fredConfig.config.themeSettingsPrefix}.theme_dir]]`);

        return value;
    }

    value = value.replace('{{theme_dir}}', fredConfig.config.themeDir);

    return value;
};

/**
 *
 * @returns {{ui: {els, ins}, valueParser, Modal, Finder, emitter, fetch, fredConfig, utilitySidebar, actions, Mousetrap, Choices, flatpicker, ColorPicker, noUiSlider, hoverintent}}
 */
export const pluginTools = () => {
    return {
        valueParser,
        ui,
        emitter,
        Modal,
        Finder,
        fetch,
        fredConfig,
        utilitySidebar,
        actions,
        Mousetrap,
        Choices,
        flatpickr,
        ColorPicker,
        noUiSlider,
        hoverintent
    };
};
