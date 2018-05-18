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