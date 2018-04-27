const setContent = (el, content) => {
    if (!content) return;
    
    if ((typeof content === 'object') && content.innerHTML) {
        el.appendChild(content);
    } else {
        el.innerHTML = content;
    }
};

export const div = (classes = []) => {
    const el = document.createElement('div');
    el.classList.add(...classes);
    
    return el;
};

export const dl = (classes = []) => {
    const el = document.createElement('dl');
    el.classList.add(...classes);

    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'tablist');
    
    return el;
};

export const dd = (classes = []) => {
    const el = document.createElement('dd');
    el.classList.add(...classes);

    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'tablist');
    
    return el;
};

export const dt = (content = '', classes = [], onClick = null) => {
    const el = document.createElement('dt');
    el.classList.add(...classes);

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
    const el = document.createElement('section');
    el.classList.add(...classes);
    
    return el;
};

export const button = (content = '', classes = [], onClick = null) => {
    const el = document.createElement('button');
    el.setAttribute('role', 'button');
    el.classList.add(...classes);
    
    setContent(el, content);
    
    if (typeof onClick === 'function') {
        el.addEventListener('click', e => {
            e.preventDefault();
            onClick(e, el);
        });
    }
    
    return el;
};

export const h1 = (content, classes = []) => {
    const el = document.createElement('h1');
    el.classList.add(...classes);

    setContent(el, content);

    return el;
};

export const h2 = (content, classes = []) => {
    const el = document.createElement('h2');
    el.classList.add(...classes);

    setContent(el, content);

    return el;
};

export const h3 = (content, classes = []) => {
    const el = document.createElement('h3');
    el.classList.add(...classes);

    setContent(el, content);

    return el;
};

export const h4 = (content, classes = []) => {
    const el = document.createElement('h4');
    el.classList.add(...classes);

    setContent(el, content);
    
    return el;
};

export const img = (src, alt = '', classes = []) => {
    const el = document.createElement('img');
    el.src = src;
    
    if (alt) {
        el.setAttribute('alt', alt);
    }
    
    el.classList.add(...classes);
    
    return el;
};

export const a = (content, title = '', href = '', classes = [], onClick = null) => {
    const el = document.createElement('a');

    setContent(el, content);
    
    if (title) {
        el.setAttribute('title', title);
    }
    
    if (href) {
        el.setAttribute('href', href);
    }
    
    el.classList.add(...classes);

    if (typeof onClick === 'function') {
        el.addEventListener('click', e => {
            e.preventDefault();
            onClick(e, el);
        });
    }
    
    return el;
};

export const i = (classes = []) => {
    const el = document.createElement('i');
    el.classList.add(...classes);

    return el;
};

export const form = (classes = []) => {
    const el = document.createElement('form');
    el.classList.add(...classes);

    return el;
};

export const label = (content, classes = []) => {
    const el = document.createElement('label');
    el.classList.add(...classes);

    setContent(el, content);

    return el;
};

export const fieldSet = (classes = []) => {
    const el = document.createElement('fieldset');
    el.classList.add(...classes);

    return el;
};

export const legend = (content = '', classes = []) => {
    const el = document.createElement('legend');
    el.classList.add(...classes);

    setContent(el, content);
    
    return el;
};

export const figure = (classes = []) => {
    const el = document.createElement('figure');
    el.classList.add(...classes);

    return el;
};

export const figCaption = (content = '', classes = []) => {
    const el = document.createElement('figcaption');
    el.classList.add(...classes);

    setContent(el, content);
    
    return el;
};

export const iFrame = (src, classes = []) => {
    const el = document.createElement('iframe');
    el.classList.add(...classes);

    el.src = src;
    
    return el;
};

export default {
    div,
    dl,
    dd,
    dt,
    section,
    button,
    h1,
    h2,
    h3,
    h4,
    a,
    i,
    img,
    form,
    label,
    fieldSet,
    legend,
    figure,
    figCaption,
    iFrame
};