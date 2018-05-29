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

export const applyScripts = el => {
    const scripts = el.querySelectorAll('script');

    for (let scriptEl of scripts) {
        const script = document.createElement('script');
        script.dataset.fredRender = 'false';
        script.innerHTML = scriptEl.innerHTML;
        
        scriptEl.parentNode.replaceChild(script, scriptEl);
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
};
