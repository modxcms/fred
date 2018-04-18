import flatpickr from "flatpickr";

export const buildTextInput = (setting, defaultValue, onChange, onInit) => {
    const label = document.createElement('label');
    label.innerHTML = setting.label || setting.name;

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.value = defaultValue;

    if (typeof onChange === 'function') {
        input.addEventListener('keyup', e => {
            onChange(setting.name, input.value, input, setting);
        });
    }

    label.appendChild(input);

    if (typeof onInit === 'function') {
        onInit(setting, label, input);
    }
    
    return label;
};

export const buildSelectInput = (setting, defaultValue, onChange, onInit) => {
    const label = document.createElement('label');
    label.innerHTML = setting.label || setting.name;

    const select = document.createElement('select');

    if (setting.options) {
        for (let value in setting.options) {
            if (setting.options.hasOwnProperty(value)) {
                const option = document.createElement('option');
                option.innerHTML = setting.options[value];
                option.value = value;

                if (value === defaultValue) {
                    option.setAttribute('selected', 'selected');
                }

                select.appendChild(option);
            }
        }
    }
    if (typeof onChange === 'function') {
        select.addEventListener('change', e => {
            if (setting.options[select.value]) {
                onChange(setting.name, select.value, select, setting);
            }
        });
    }

    label.appendChild(select);

    if (typeof onInit === 'function') {
        onInit(setting, label, select);
    }

    return label;
};

export const buildToggleInput = (setting, defaultValue, onChange, onInit) => {
    const label = document.createElement('label');
    label.classList.add('fred--toggle');
    label.innerHTML = setting.label || setting.name;

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    if (defaultValue === true) {
        input.setAttribute('checked', 'checked');
    }

    if (typeof onChange === 'function') {
        input.addEventListener('change', e => {
            onChange(setting.name, e.target.checked, input, setting);
        });
    }

    const span = document.createElement('span');

    label.appendChild(input);
    label.appendChild(span);
    
    if (typeof onInit === 'function') {
        onInit(setting, label, input, span);
    }

    return label;
};

export const buildTextAreaInput = (setting, defaultValue, onChange, onInit) => {
    const label = document.createElement('label');
    label.innerHTML = setting.label || setting.name;

    const textarea = document.createElement('textarea');
    textarea.innerHTML = defaultValue;

    if (typeof onChange === 'function') {
        textarea.addEventListener('keyup', e => {
            onChange(setting.name, textarea.value, textarea, setting);
        });
    }

    label.appendChild(textarea);

    if (typeof onInit === 'function') {
        onInit(setting, label, textarea);
    }

    return label;
};

export const buildDateTimeInput = (setting, defaultValue, onChange, onInit) => {
    defaultValue = parseInt(defaultValue) || 0;
    
    const label = document.createElement('label');
    label.innerHTML = setting.label || setting.name;

    const group = document.createElement('div');
    group.classList.add('fred--input-group', 'fred--datetime');

    const input = document.createElement('input');

    const picker = flatpickr(input, {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        appendTo: group,
        defaultDate: (defaultValue === 0) ? '' : (defaultValue * 1000),
        onChange: selectedDates => {
            if (typeof onChange === 'function') {
                if (selectedDates.length === 0) {
                    onChange(setting.name, 0, picker, setting);
                } else {
                    onChange(setting.name, selectedDates[0].getTime() / 1000, picker, setting);
                }
            }
        }
    });

    const clear = document.createElement('a');
    clear.classList.add('fred--close-small');
    clear.setAttribute('title', 'Clear');
    clear.addEventListener('click', e => {
        e.preventDefault();
        picker.clear();
    });

    group.appendChild(input);
    group.appendChild(clear);

    label.appendChild(group);

    if (typeof onInit === 'function') {
        onInit(setting, label, input);
    }

    return label;
};

export default {
    buildTextInput,
    buildSelectInput,
    buildToggleInput,
    buildTextAreaInput,
    buildDateTimeInput
};