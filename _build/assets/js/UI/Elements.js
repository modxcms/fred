import fredConfig from '../Config';

const setContent = (el, content) => {
    if (!content) return;
    
    if (Array.isArray(content)) {
        content.forEach(contentEl => {
            if ((typeof contentEl === 'object') && (contentEl.innerHTML !== undefined)) {
                el.appendChild(contentEl);        
            } else if (typeof contentEl === 'string') {
                if (fredConfig.lngExists(contentEl)) {
                    el.innerHTML = fredConfig.lng(contentEl);
                } else {
                    el.innerHTML = contentEl;
                }
            }
        });    
    } else if ((typeof content === 'object') && (content.innerHTML !== undefined)) {
        el.appendChild(content);
    } else {
        if (fredConfig.lngExists(content)) {
            el.innerHTML = fredConfig.lng(content);
        } else {
            el.innerHTML = content;
        }
    }
};

const setClasses = (el, classes) => {
    if (!classes) return;
    
    if (Array.isArray(classes)) {
        el.classList.add(...classes);   
    } else {
        el.classList = classes;
    }
};

const createElement = (tag, classes = []) => {
    const el = document.createElement(tag);
    setClasses(el, classes);
    
    return el;
};

export const div = (classes = [], content = '') => {
    const el = createElement('div', classes);
    setContent(el, content);
    
    return el;
};

export const span = (classes = [], content = '') => {
    const el = createElement('span', classes);
    setContent(el, content);
    
    return el;
};

export const dl = (classes = []) => {
    const el = createElement('dl', classes);

    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'tablist');
    
    return el;
};

export const dd = (classes = []) => {
    const el = createElement('dd', classes);

    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'tablist');
    
    return el;
};

export const dt = (content = '', classes = [], onClick = null) => {
    const el = createElement('dt', classes);

    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'tab');

    setContent(el, content);

    if (typeof onClick === 'function') {
        el.addEventListener('click', e => {
            e.preventDefault();
            onClick(e, el);
        });
    }
    
    return el;
};

export const section = (classes = []) => {
    return createElement('section', classes);
};

export const button = (content = '', title = '', classes = [], onClick = null) => {
    const el = createElement('button', classes);
    
    el.setAttribute('role', 'button');
    
    setContent(el, content);
    
    if (title) {
        if (fredConfig.lngExists(title)) {
            el.setAttribute('title', fredConfig.lng(title));
        } else {
            el.setAttribute('title', title);
        }
    }
    
    if (typeof onClick === 'function') {
        el.addEventListener('click', e => {
            e.preventDefault();
            onClick(e, el);
        });
    }
    
    return el;
};

export const table = (content, classes = []) => {
    const el = createElement('table', classes);

    setContent(el, content);

    return el;
};

export const tr = (content, classes = []) => {
    const el = createElement('tr', classes);

    setContent(el, content);

    return el;
};

export const td = (content, classes = []) => {
    const el = createElement('td', classes);

    setContent(el, content);

    return el;
};

export const th = (content, classes = []) => {
    const el = createElement('th', classes);

    setContent(el, content);

    return el;
};

export const h1 = (content, classes = []) => {
    const el = createElement('h1', classes);

    setContent(el, content);

    return el;
};

export const h2 = (content, classes = []) => {
    const el = createElement('h2', classes);

    setContent(el, content);

    return el;
};

export const h3 = (content, classes = []) => {
    const el = createElement('h3', classes);

    setContent(el, content);

    return el;
};

export const h4 = (content, classes = []) => {
    const el = createElement('h4', classes);

    setContent(el, content);
    
    return el;
};

export const img = (src, alt = '', classes = []) => {
    const el = createElement('img', classes);
    el.src = src;
    
    if (alt) {
        el.setAttribute('alt', alt);
    }

    return el;
};

export const a = (content, title = '', href = '', classes = [], onClick = null) => {
    const el = createElement('a', classes);

    setContent(el, content);
    
    if (title) {
        if (title) {
            if (fredConfig.lngExists(title)) {
                el.setAttribute('title', fredConfig.lng(title));
            } else {
                el.setAttribute('title', title);
            }
        }
    }
    
    if (href) {
        el.setAttribute('href', href);
    }

    if (typeof onClick === 'function') {
        el.addEventListener('click', e => {
            e.preventDefault();
            onClick(e, el);
        });
    }
    
    return el;
};

export const i = (classes = []) => {
    return createElement('i', classes);
};

export const form = (classes = []) => {
    return createElement('form', classes);
};

export const label = (content, classes = []) => {
    const el = createElement('label', classes);

    setContent(el, content);

    return el;
};

export const input = (value = '', type = 'text', classes = []) => {
    const el = createElement('input', classes);
    el.setAttribute('type', type);
    
    if (value) {
        if (type === 'checkbox') {
            if (value === true) {
                el.setAttribute('checked', 'checked');
            }
        } else {
            el.value = value;
        }
    }

    return el;
};

export const select = (classes = []) => {
    return createElement('select', classes);
};

export const textArea = (value = '', classes = []) => {
    const el = createElement('textarea', classes);
    el.innerHTML = value;
    
    return el;
};

export const fieldSet = (classes = []) => {
    return createElement('fieldset', classes);
};

export const legend = (content = '', classes = []) => {
    const el = createElement('legend', classes);

    setContent(el, content);
    
    return el;
};

export const figure = (classes = []) => {
    return createElement('figure', classes);
};

export const figCaption = (content = '', classes = []) => {
    const el = createElement('figcaption', classes);

    setContent(el, content);
    
    return el;
};

export const iFrame = (src, classes = []) => {
    const el = createElement('iframe', classes);

    el.src = src;
    
    return el;
};

export default {
    div,
    span,
    dl,
    dd,
    dt,
    section,
    button,
    table,
    tr,
    th,
    td,
    h1,
    h2,
    h3,
    h4,
    a,
    i,
    img,
    form,
    label,
    input,
    select,
    textArea,
    fieldSet,
    legend,
    figure,
    figCaption,
    iFrame
};