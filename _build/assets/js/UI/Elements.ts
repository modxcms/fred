import fredConfig from '@fred/Config';

type Content = string|string[]|HTMLElement|HTMLElement[];
type Classes = string|string[];
type OnClick<T extends HTMLElement = HTMLElement> = null|((e: MouseEvent, el: T) => void);

const setContent = (el: HTMLElement, content: Content) => {
    if (!content) return;

    if (Array.isArray(content)) {
        content.forEach(contentEl => {
            setContent(el, contentEl);
        });
    } else {
        if ((typeof content === 'object') && (content.innerHTML !== undefined)) {
            el.appendChild(content);
        } else if (typeof content === 'string') {
            if (fredConfig.lngExists(content)) {
                el.innerHTML = fredConfig.lng(content);
            } else {
                el.innerHTML = content;
            }
        }
    }
};

const setClasses = (el: HTMLElement, classes: Classes) => {
    if (!classes) return;

    if (Array.isArray(classes)) {
        el.classList.add(...classes);
    } else {
        el.className = classes;
    }
};

const createElement = <R extends HTMLElement = HTMLElement>(tag: string, classes: Classes = []): R  => {
    const el = document.createElement(tag) as R;
    setClasses(el, classes);

    return el;
};

export const div = (classes: Classes = [], content: Content = '') => {
    const el = createElement<HTMLDivElement>('div', classes);
    setContent(el, content);

    return el;
};

export const span = (classes: Classes = [], content: Content = '') => {
    const el = createElement<HTMLSpanElement>('span', classes);
    setContent(el, content);

    return el;
};

export const dl = (classes: Classes = []) => {
    const el = createElement<HTMLDListElement>('dl', classes);

    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'tablist');

    return el;
};

export const dd = (classes: Classes = []) => {
    const el = createElement('dd', classes);

    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'tablist');

    return el;
};

export const dt = (content: Content = '', classes: Classes = [], onClick: OnClick = null) => {
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

export const section = (classes: Classes = []) => {
    return createElement('section', classes);
};

export const button = (content: Content = '', title: string = '', classes: Classes = [], onClick: OnClick<HTMLButtonElement> = null) => {
    const el = createElement<HTMLButtonElement>('button', classes);

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

export const table = (content: Content = '', classes: Classes = []) => {
    const el = createElement<HTMLTableElement>('table', classes);

    setContent(el, content);

    return el;
};

export const tr = (content: Content = '', classes: Classes = []) => {
    const el = createElement<HTMLTableRowElement>('tr', classes);

    setContent(el, content);

    return el;
};

export const td = (content: Content = '', classes: Classes = []) => {
    const el = createElement<HTMLTableCellElement>('td', classes);

    setContent(el, content);

    return el;
};

export const th = (content: Content = '', classes: Classes = []) => {
    const el = createElement<HTMLTableCellElement>('th', classes);

    setContent(el, content);

    return el;
};

export const h1 = (content: Content = '', classes: Classes = []) => {
    const el = createElement<HTMLHeadingElement>('h1', classes);

    setContent(el, content);

    return el;
};

export const h2 = (content: Content = '', classes: Classes = []) => {
    const el = createElement<HTMLHeadingElement>('h2', classes);

    setContent(el, content);

    return el;
};

export const h3 = (content: Content = '', classes: Classes = []) => {
    const el = createElement<HTMLHeadingElement>('h3', classes);

    setContent(el, content);

    return el;
};

export const h4 = (content: Content = '', classes: Classes = []) => {
    const el = createElement<HTMLHeadingElement>('h4', classes);

    setContent(el, content);

    return el;
};

export const img = (src: string = '', alt: string = '', classes: Classes = []) => {
    const el = createElement<HTMLImageElement>('img', classes);
    el.src = src;

    if (alt) {
        el.setAttribute('alt', alt);
    }

    return el;
};

export const a = (content: Content = '', title: string = '', href: string = '', classes: Classes = [], onClick: OnClick<HTMLAnchorElement> = null) => {
    const el = createElement<HTMLAnchorElement>('a', classes);

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

export const i = (classes: Classes = []) => {
    return createElement('i', classes);
};

export const form = (classes: Classes = []) => {
    return createElement<HTMLFormElement>('form', classes);
};

export const label = (content: Content = '', classes: Classes = []) => {
    const el = createElement<HTMLLabelElement>('label', classes);

    setContent(el, content);

    return el;
};

export const input = (value: string|boolean = '', type: string = 'text', classes: Classes = []) => {
    const el = createElement<HTMLInputElement>('input', classes);
    el.setAttribute('type', type);

    if (value) {
        if (type === 'checkbox') {
            if (value === true) {
                el.setAttribute('checked', 'checked');
            }
        } else {
            el.value = '' + value;
        }
    }

    return el;
};

export const select = (classes: Classes = []) => {
    return createElement<HTMLSelectElement>('select', classes);
};

export const textArea = (value: string = '', classes: Classes = []) => {
    const el = createElement<HTMLTextAreaElement>('textarea', classes);
    el.innerHTML = value;

    return el;
};

export const fieldSet = (classes: Classes = []) => {
    return createElement<HTMLFieldSetElement>('fieldset', classes);
};

export const legend = (content: Content = '', classes: Classes = []) => {
    const el = createElement<HTMLLegendElement>('legend', classes);

    setContent(el, content);

    return el;
};

export const figure = (classes: Classes = []) => {
    return createElement('figure', classes);
};

export const figCaption = (content: Content = '', classes: Classes = []) => {
    const el = createElement('figcaption', classes);

    setContent(el, content);

    return el;
};

export const iFrame = (src: string, classes: Classes = []) => {
    const el = createElement<HTMLIFrameElement>('iframe', classes);

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
