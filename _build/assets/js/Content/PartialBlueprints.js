import utilitySidebar from '../Components/UtilitySidebar';
import {choices, text, toggle} from "../UI/Inputs";
import {button, div, fieldSet, form, i, img, input, label, legend, span} from "../UI/Elements";
import cache from "../Cache";
import emitter from "../EE";
import fredConfig from "../Config";
import { getBlueprints, createBlueprint } from '../Actions/blueprints';
import MultiSelect from "@fred/UI/MultiSelect";
import {getTemplates} from "../Actions/themes";

const IMAGE_MIME_REGEX = /^image\/(jpe?g|png)$/i;
const maxWidth = 540;

export class PartialBlueprints {
    open(el) {
        this.el = el;
        this.categories = [];

        this.state = {
            name: '',
            category: null,
            rank: '',
            public: !!fredConfig.permission.fred_blueprints_create_public,
            description: '',
            generatedImage: '',
            templates: ''
        };

        getBlueprints().then(value => {
            value.forEach(category => {
                if (this.state.category === null) {
                    this.state.category = category.id
                }

                this.categories.push({
                    label: category.category,
                    id: category.id,
                    value: '' + category.id
                });
            });

            utilitySidebar.open(this.render());
        });
    }

    render() {
        const pageForm = form(['fred--pages_create']);

        const fields = fieldSet();
        const title = legend('fred.fe.blueprints.create_blueprint', ['fred--panel_blueprint']);

        const onChange = (name, value) => {
            this.state[name] = value;
        };

        const onChangeChoices = (name, value) => {
            this.state[name] = value.value;
        };

        fields.appendChild(title);


        const name = text({
            name: 'name',
            label: 'fred.fe.blueprints.blueprint_name'
        }, this.state.name, onChange);

        fields.appendChild(name);

        const loadImage = (file) => {
            const reader = new FileReader();
            reader.onload = e => {
                const image = new Image();
                image.src = e.target.result;

                image.onload = () => {
                    if (image.width > maxWidth) {
                        const ratio = maxWidth / image.width;

                        const resizedCanvas = document.createElement("canvas");
                        const ctx = resizedCanvas.getContext("2d");

                        resizedCanvas.width = image.width * ratio;
                        resizedCanvas.height = image.height * ratio;

                        ctx.drawImage(image, 0, 0, resizedCanvas.width, resizedCanvas.height);

                        this.state.generatedImage = resizedCanvas.toDataURL();
                    } else {
                        this.state.generatedImage = e.target.result;
                    }

                    dropArea.innerHTML = '';
                    dropArea.appendChild(img(this.state.generatedImage));
                };
            };
            reader.readAsDataURL(file);
        };

        const {dropArea, wrapper, pasteHandler} = this.createDropArea(loadImage);

        const imageLabel = label('fred.fe.blueprints.blueprint_thumbnail');
        imageLabel.appendChild(wrapper);

        fields.appendChild(imageLabel);

        const category = choices({
            name: 'category',
            label: fredConfig.lng('fred.fe.blueprints.blueprint_category'),
            choices: {
                choices : this.categories,
                shouldSort: false
            }
        }, this.state.category, onChangeChoices);

        fields.appendChild(category);

        fields.appendChild(text({
            name: 'rank',
            label: 'fred.fe.blueprints.blueprint_rank'
        }, this.state.rank, onChange));

        const publicToggle = toggle({
            name: 'public',
            label: 'fred.fe.blueprints.blueprint_public'
        }, this.state.public, onChange);

        if (!fredConfig.permission.fred_blueprints_create_public) {
            publicToggle.inputEl.setAttribute('disabled', 'disabled');
        }

        fields.appendChild(publicToggle);

        const onChangeTemplates = (tags) => {
            this.state.templates = tags.reduce(
                (acc, currentValue) => {
                    if (acc === '') {
                        acc = "" + currentValue.value;
                    } else {
                        acc += `,${currentValue.value}`;
                    }

                    return acc;
                },
                ''
            );
        };

        const templates = MultiSelect({
            name: 'templates',
            label: fredConfig.lng('fred.fe.blueprints.templates')
        }, getTemplates, onChangeTemplates);

        templates.querySelector('.fred--tagger_input_wrapper').appendChild(div('fred--tagger_description', 'fred.fe.blueprints.current_note'));

        fields.appendChild(templates);

        const createButton = button('fred.fe.blueprints.create_blueprint', 'fred.fe.blueprints.create_blueprint', ['fred--btn-panel', 'fred--btn-apply'], () => {
            emitter.emit('fred-loading', fredConfig.lng('fred.fe.blueprints.creating_blueprint'));

            createBlueprint(
                this.state.name,
                this.state.description,
                this.state.category,
                this.state.rank,
                this.state.public,
                [this.el.getContent(true)],
                this.state.generatedImage,
                false,
                this.state.templates
            )
                .then(json => {
                    cache.killNamespace('blueprints');
                    utilitySidebar.close();
                    emitter.emit('fred-loading-hide');
                }).catch(err => {
                if (err.response && err.response._fields) {
                    if (err.response._fields.name) {
                        name.onError(err.response._fields.name);
                    }

                    if (err.response._fields.category) {
                        category.onError(err.response._fields.category);
                    }

                    emitter.emit('fred-loading-hide');
                }
            });
        });
        const cancelButton = button('fred.fe.cancel', 'fred.fe.cancel', ['fred--btn-panel'], () => {
            utilitySidebar.close();
            document.removeEventListener('paste', pasteHandler);
        });

        const buttonGroup = div(['fred--panel_button_wrapper']);
        buttonGroup.appendChild(createButton);
        buttonGroup.appendChild(cancelButton);
        fields.appendChild(buttonGroup);

        pageForm.appendChild(fields);

        return pageForm;
    }

    createDropArea(loadImage) {
        const dropArea = div('', [i(), span([], 'fred.fe.content.element_screenshot_text')]);
        const fileInput = input('', 'file');
        const wrapper = div('fred--element_screenshot_upload_wrapper', [fileInput, dropArea]);

        const pasteHandler = (e) => {
            e.preventDefault();
            var items = e.clipboardData.items;

            for (var i = 0; i < items.length; i++) {
                if (IMAGE_MIME_REGEX.test(items[i].type)) {
                    loadImage(items[i].getAsFile());
                    return;
                }
            }
        };
        const handleFiles = (files) => {
            for (var i = 0; i < files.length; i++) {

                // get the next file that the user selected
                var file = files[i];
                var imageType = /image.*/;

                // don't try to process non-images
                if (!file.type.match(imageType)) {
                    continue;
                }

                loadImage(file);
                break;
            }
        }

        fileInput.setAttribute('accept', 'image/*');
        fileInput.addEventListener("change", (e) => {
            handleFiles(e.target.files);
        }, false);

        dropArea.addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();

            dropArea.classList.add('over');
        });
        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();

            dropArea.classList.add('over');
        });
        dropArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();

            dropArea.classList.remove('over');
        });
        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const files = e.dataTransfer.files;
            dropArea.classList.remove('over');

            handleFiles(files);
        });
        dropArea.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            fileInput.click();
        });

        document.addEventListener('paste', pasteHandler);

        return {
            dropArea,
            pasteHandler,
            wrapper
        };
    }
}

const partialBlueprints = new PartialBlueprints();
export default partialBlueprints;
