import flatpickr from "flatpickr";
import Choices from 'choices.js';
import ColorPicker from './ColorPicker/ColorPicker';
import noUiSlider from 'nouislider';
import fetch from "isomorphic-fetch";
import Finder from "./Finder";
import fredConfig from './Config';

export const buildTextInput = (setting, defaultValue = '', onChange, onInit) => {
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

export const buildSelectInput = (setting, defaultValue = '', onChange, onInit) => {
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

export const buildToggleInput = (setting, defaultValue = false, onChange, onInit) => {
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

export const buildTextAreaInput = (setting, defaultValue = '', onChange, onInit) => {
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

export const buildDateTimeInput = (setting, defaultValue = 0, onChange, onInit) => {
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

export const buildColorSwatchInput = (setting, defaultValue = '', onChange, onInit) => {
    const label = document.createElement('label');
    label.innerHTML = setting.label || setting.name;

    const wrapper = document.createElement('div');
    wrapper.classList.add('fred--color_swatch');
    
    const preview = document.createElement('div');
    preview.classList.add('fred--color_swatch-preview');
    
    if (defaultValue) {
        preview.style.backgroundColor = defaultValue;
    }
    
    const colors = document.createElement('div');
    colors.classList.add('fred--color_swatch-colors', 'fred--hidden');

    let isOpen = false;

    preview.addEventListener('click', e => {
        e.preventDefault();
        if (isOpen === false) {
            isOpen = true;
            colors.classList.remove('fred--hidden');
        } else {
            isOpen = false;
            colors.classList.add('fred--hidden');
        }
    });
    
    let defaultValueTranslated = false;

    if (setting.options) {
        setting.options.forEach(value => {
            if (typeof value === 'object') {
                const option = document.createElement('div');
                option.classList.add('fred--color_swatch-color');
                option.style.backgroundColor = value.color;
                
                if (value.label && value.label.trim() !== '') {
                    option.setAttribute('data-tooltip', value.label);
                }

                if (!defaultValueTranslated && defaultValue && (value.value === defaultValue)) {
                    defaultValueTranslated = true;
                    
                    if (defaultValue) {
                        preview.style.backgroundColor = value.color;
                    }
                }
                
                option.addEventListener('click', e => {
                    e.preventDefault();
                    if (typeof onChange === 'function') {
                        onChange(setting.name, value.value, option, setting);
                    }

                    preview.style.backgroundColor = value.color;
                });

                colors.appendChild(option);
            } else {
                const option = document.createElement('div');
                option.classList.add('fred--color_swatch-color');
                option.style.backgroundColor = value;
    
                option.addEventListener('click', e => {
                    e.preventDefault();
                    if (typeof onChange === 'function') {
                        onChange(setting.name, value, option, setting);
                    }
    
                    preview.style.backgroundColor = value;
                });
                
                colors.appendChild(option);
            }
        });
    }

    wrapper.appendChild(preview);
    wrapper.appendChild(colors);
    
    label.appendChild(wrapper);

    if (typeof onInit === 'function') {
        onInit(setting, label, wrapper, preview, colors);
    }
    
    return label;
};

export const buildColorPickerInput = (setting, defaultValue = '', onChange, onInit) => {
    const label = document.createElement('label');
    label.innerHTML = setting.label || setting.name;

    const wrapper = document.createElement('div');
    wrapper.classList.add('fred--color_picker');
    
    const preview = document.createElement('div');
    preview.classList.add('fred--color_picker-preview');
    
    let isOpen = false;
    let pickerInstance = null;

    preview.addEventListener('click', e => {
        e.preventDefault();
        if (isOpen === false) {
            isOpen = true;
            
            pickerInstance = ColorPicker.createPicker({
                attachTo: picker,
                color: defaultValue,
                showAlpha: (setting.showAlpha === undefined) ? true : setting.showAlpha,
                paletteEditable: false,
                palette: setting.options || null
            });
            
            pickerInstance.onchange = (picker) => {
                if (typeof onChange === 'function') {
                    onChange(setting.name, picker.color, picker, setting);
                }

                preview.style.backgroundColor = picker.color;
                defaultValue = picker.color;
            };
        } else {
            if (pickerInstance !== null) {
                pickerInstance.element.remove();
                pickerInstance = null;
            }

            isOpen = false;
        }
    });
    
    if (defaultValue) {
        preview.style.backgroundColor = defaultValue;
    }

    const picker = document.createElement('div');
    
    wrapper.appendChild(preview);
    wrapper.appendChild(picker);
    
    label.appendChild(wrapper);

    if (typeof onInit === 'function') {
        onInit(setting, label, wrapper, preview, picker);
    }
    
    return label;
};

export const buildSliderInput = (setting, defaultValue = 0, onChange, onInit) => {
    const label = document.createElement('label');
    label.innerHTML = setting.label || setting.name;

    if (!setting.min && !setting.max) {
        console.error('Slider Input error. Parameters min and max are required');
        return label;
    }
    
    const sliderEl = document.createElement('div');

    let step = 1;
    if (setting.step) {
        step = setting.step;
    } else {
        if (setting.tooltipDecimals) {
            step = Math.pow(10, -1 * setting.tooltipDecimals);
        }
    }
    
    const slider = noUiSlider.create(sliderEl, {
        start: defaultValue,
        connect: [true, false],
        tooltips: {
            to: value => {
                const decimals = (setting.tooltipDecimals === undefined) ? 0 : setting.tooltipDecimals;
    
                if (decimals === 0) {
                    return parseInt(value.toFixed());
                }
                
                return parseFloat(value.toFixed(decimals));
            }
        },
        step: step,
        range: {
            'min': setting.min,
            'max': setting.max
        }
    });

    sliderEl.querySelector('.noUi-handle').addEventListener('keydown', function( e ) {

        const value = Number(sliderEl.noUiSlider.get());

        if (e.which === 37) {
            sliderEl.noUiSlider.set(value - step);
        }

        if (e.which === 39) {
            sliderEl.noUiSlider.set(value + step);
        }
    });

    if (typeof onChange === 'function') {
        slider.on('update', (values, handle, unencoded, tap, positions) => {
            onChange(setting.name, values[0], slider, setting);
        });
    }

    label.appendChild(sliderEl);

    if (typeof onInit === 'function') {
        onInit(setting, label, sliderEl);
    }

    return label;
};

export const buildPageInput = (setting, defaultValue = {id: 0, url: ''}, onChange, onInit) => {
    const wrapper = document.createElement('div');
    
    const label = document.createElement('label');
    label.innerHTML = setting.label || setting.name;
    label.classList.add('fred--label-choices');

    const input = document.createElement('select');

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    
    let lookupTimeout = null;
    const lookupCache = {};
    let initData = [];

    const pageChoices = new Choices(input, {
        removeItemButton: setting.clearButton || false
    });
    
    pageChoices.ajax(callback => {
        fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=get-resources&current=${defaultValue.id}`)
            .then(response => {
                return response.json()
            })
            .then(json => {
                initData = json.data.resources;
                callback(json.data.resources, 'value', 'pagetitle');

                if (json.data.current) {
                    pageChoices.setChoices([json.data.current], 'value', 'pagetitle', false);
                    pageChoices.setValueByChoice("" + defaultValue.id);
                }
            })
            .catch(error => {
                console.log(error);
            });
    });

    const populateOptions = options => {
        const toRemove = [];

        pageChoices.currentState.items.forEach(item => {
            if (item.active) {
                toRemove.push(item.value);
            }
        });

        const toKeep = [];
        options.forEach(option => {
            if (toRemove.indexOf(option.id) === -1) {
                toKeep.push(option);
            }
        });

        pageChoices.setChoices(toKeep, 'value', 'pagetitle', true);
    };

    const serverLookup = () => {
        const query = pageChoices.input.value;
        if (query in lookupCache) {
            populateOptions(lookupCache[query]);
        } else {
            fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=get-resources&query=${query}`)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    lookupCache[query] = data.data.resources;
                    populateOptions(data.data.resources);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };

    pageChoices.passedElement.addEventListener('search', event => {
        clearTimeout(lookupTimeout);
        lookupTimeout = setTimeout(serverLookup, 200);
    });

    pageChoices.passedElement.addEventListener('choice', event => {
        pageChoices.setChoices(initData, 'value', 'pagetitle', true);

        if (typeof onChange === 'function') {
            onChange(setting.name, {
                url: event.detail.choice.customProperties.url,
                id: event.detail.choice.value
            }, pageChoices, setting);
        }
    });

    pageChoices.passedElement.addEventListener('removeItem', event => {
        if (pageChoices.getValue()) return;

        if (typeof onChange === 'function') {
            onChange(setting.name, {url: '', id: ''}, pageChoices, setting);
        }
    });

    if (typeof onInit === 'function') {
        onInit(setting, label, input);
    }

    return wrapper;
};

export const buildImageInput = (setting, defaultValue = '', onChange, onInit) => {
    const label = document.createElement('label');
    label.innerHTML = setting.label || setting.name;

    setting.showPreview = (setting.showPreview === undefined) ? true : setting.showPreview;

    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add('fred--input-group', 'fred--browse');
    
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.value = defaultValue;

    const openFinderButton = document.createElement('a');
    openFinderButton.classList.add('fred--browse-small');
    openFinderButton.setAttribute('title', 'Browse');

    const preview = document.createElement('img');
    let previewAdded = false;
    
    const finderOptions = {};
    
    if (setting.mediaSource && (setting.mediaSource !== '')) {
        finderOptions.mediaSource = setting.mediaSource;
    }

    input.addEventListener('keyup', e => {
        if (typeof onChange === 'function') {
            onChange(setting.name, input.value, input, setting);
        }

        if((setting.showPreview === true) && input.value) {
            preview.src = input.value;
            if (!previewAdded) {
                label.appendChild(preview);
                previewAdded = true;
            }
        } else {
            if (previewAdded) {
                preview.src = '';
                preview.remove();
                previewAdded = false;
            } 
        }
    });
    
    openFinderButton.addEventListener('click', e => {
        e.preventDefault();

        const finder = new Finder((file, fm) => {
            if (typeof onChange === 'function') {
                onChange(setting.name, file.url, input, setting);
            }
            
            input.value = file.url;
            preview.src = file.url;
            
            if ((setting.showPreview === true) && !previewAdded) {
                label.appendChild(preview);
                previewAdded = true;
            }
        }, 'Browse Images', finderOptions);

        finder.render();
    });

    inputWrapper.appendChild(input);
    inputWrapper.appendChild(openFinderButton);

    label.appendChild(inputWrapper);

    if(input.value) {
        preview.src = input.value;
    }
    
    if ((setting.showPreview === true) && preview.src) {
        label.appendChild(preview);
        previewAdded = true;
    }

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
    buildDateTimeInput,
    buildColorSwatchInput,
    buildColorPickerInput,
    buildSliderInput,
    buildPageInput,
    buildImageInput
};