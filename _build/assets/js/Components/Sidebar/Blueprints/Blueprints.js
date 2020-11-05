import SidebarPlugin from '../../SidebarPlugin';
import emitter from '../../../EE';
import {
    dd,
    dl,
    dt,
    form,
    fieldSet,
    legend,
    div,
    button,
    figCaption,
    figure,
    img,
    span,
    i,
    input, label
} from '@fred/UI/Elements';
import {choices, text, toggle, image, area} from "@fred/UI/Inputs";
import fredConfig from "../../../Config";
import cache from '../../../Cache';
import hoverintent from "hoverintent";
import drake from "../../../Drake";
import { getBlueprints, createBlueprint, createBlueprintCategory } from '../../../Actions/blueprints';
import { getTemplates } from '../../../Actions/themes';
import MultiSelect from "@fred/UI/MultiSelect";

const IMAGE_MIME_REGEX = /^image\/(jpe?g|png)$/i;
const maxWidth = 540;

export default class Blueprints extends SidebarPlugin {
    static title = 'fred.fe.blueprints';
    static icon = 'fred--sidebar_blueprints';
    static expandable = true;

    init() {
        this.openCreateBlueprint = this.openCreateBlueprint.bind(this);
        this.categories = [];
        this.tempaltes = [];
        this.pasteHandler = null;

        this.state = {
            category: {
                name: '',
                rank: '',
                templates: '',
                public: !!fredConfig.permission.fred_blueprint_categories_create_public
            },
            blueprint: {
                name: '',
                description: '',
                category: null,
                rank: '',
                public: !!fredConfig.permission.fred_blueprints_create_public,
                generatedImage: '',
                templates: ''
            }
        };
    }

    async click() {
        this.pasteHandler = null;
        const blueprints = await getBlueprints();

        return this.buildPanel(blueprints);
    }

    buildBlueprints(content, categories) {
        categories.forEach(category => {
            if (this.state.blueprint.category === null) {
                this.state.blueprint.category = category.id
            }

            this.categories.push({
                label: category.category,
                id: category.id,
                value: '' + category.id
            });

            if (category.blueprints.length === 0) {
                return true;
            }

            const categoryTab = dt(category.category, [], (e, el) => {
                const activeTabs = el.parentElement.querySelectorAll('dt.active');

                const isActive = el.classList.contains('active');

                for (let tab of activeTabs) {
                    tab.classList.remove('active');
                }

                if (!isActive) {
                    el.classList.add('active');
                    e.stopPropagation();
                    emitter.emit('fred-sidebar-dt-active', categoryTab, categoryContent);
                }
            });

            hoverintent(categoryTab,
                function(e){
                    let el = e.target;
                    const activeTabs = el.parentElement.querySelectorAll('dt.active');

                    const isActive = el.classList.contains('active');

                    for (let tab of activeTabs) {
                        if(tab === el) continue;
                        tab.classList.remove('active');
                    }

                    if (!isActive) {
                        el.classList.add('active');
                        emitter.emit('fred-sidebar-dt-active', categoryTab, categoryContent);
                    }
                },
                function(e){

                }
            );
            const categoryContent = dd();
            const categoryEl = div(['fred--thumbs', 'source', 'blueprints-source']);

            category.blueprints.forEach(blueprint => {
                categoryEl.appendChild(Blueprints.wrapper(blueprint.id, blueprint.name, blueprint.description, blueprint.image));
            });

            categoryContent.appendChild(categoryEl);

            content.appendChild(categoryTab);
            content.appendChild(categoryContent);
        });
    }

    static wrapper(id, name, description, image) {
        const element = figure(['fred--thumb']);

        const imageWrapper = div();
        const elementImage = img(image, name);

        imageWrapper.appendChild(elementImage);

        const caption = figCaption(`<strong>${name}</strong><em>${description}</em>`);

        const chunk = div(['chunk']);
        chunk.dataset.fredBlueprintId = id;
        chunk.dataset.fredBlueprintName = name;
        chunk.setAttribute('hidden', 'hidden');

        element.appendChild(imageWrapper);
        element.appendChild(caption);
        element.appendChild(chunk);

        return element;
    }

    buildPanel(blueprints) {
        const content = dl();
        this.categories = [];

        this.buildBlueprints(content, blueprints);

        if (fredConfig.permission.fred_blueprint_categories_save) {
            this.buildCreateCategory(content);
        }

        if (fredConfig.permission.fred_blueprints_save) {
            this.buildCreateBlueprint(content);
        }

        return content;
    }
    buildCreateBlueprint(content) {
        this.formWrapper = dd();

        this.pageForm = form(['fred--pages_create']);

        this.createBlueprintButton = dt('fred.fe.blueprints.create_blueprint', ['fred--accordion-cog'], e => this.openCreateBlueprint(e, content));
        this.createBlueprintButton.setAttribute('hidden', 'hidden');

        const mutationCallback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type !== 'attributes') continue;
                if (mutation.attributeName !== 'class') continue;

                if (!mutation.target.classList.contains('active')) {
                     if (this.pasteHandler !== null) {
                         document.removeEventListener('paste', this.pasteHandler);
                     }
                }
            }
        };
        const observer = new MutationObserver(mutationCallback);
        observer.observe(this.createBlueprintButton, {attributes: true});

        this.createBlueprintButtonSm = button('+','fred.fe.blueprints.create_blueprint',['fred--btn-small','fred--btn-add'], e => this.openCreateBlueprint(e, content));

        this.formWrapper.appendChild(this.pageForm);

        content.appendChild(this.createBlueprintButton);
        content.appendChild(this.formWrapper);
        content.appendChild(this.createBlueprintButtonSm);
    }

    openCreateBlueprint(e, content) {
        const activeTabs = content.querySelectorAll('dt.active');

        const isActive = this.createBlueprintButton.classList.contains('active');

        for (let tab of activeTabs) {
            tab.classList.remove('active');
        }

        if (!isActive) {
            this.pageForm.innerHTML = '';

            const fields = fieldSet();
            const title = legend('fred.fe.blueprints.create_blueprint');

            const onChange = (name, value) => {
                this.state.blueprint[name] = value;
            };

            const onChangeChoices = (name, value) => {
                this.state.blueprint[name] = value.value;
            };

            fields.appendChild(title);


            const name = text({
                name: 'name',
                label: 'fred.fe.blueprints.blueprint_name'
            }, this.state.blueprint.name, onChange);

            fields.appendChild(name);

            fields.appendChild(area({
                name: 'description',
                label: 'fred.fe.blueprints.blueprint_description'
            }, this.state.blueprint.description, onChange));

            const onChangeTemplates = (tags) => {
                this.state.blueprint.templates = tags.reduce(
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

                            this.state.blueprint.generatedImage = resizedCanvas.toDataURL();
                        } else {
                            this.state.blueprint.generatedImage = e.target.result;
                        }

                        dropArea.innerHTML = '';
                        dropArea.appendChild(img(this.state.blueprint.generatedImage));
                    };
                };
                reader.readAsDataURL(file);
            };

            const {dropArea, wrapper, pasteHandler} = this.createDropArea(loadImage);
            this.pasteHandler = pasteHandler;

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
            }, this.state.blueprint.category, onChangeChoices);

            fields.appendChild(category);

            fields.appendChild(text({
                name: 'rank',
                label: 'fred.fe.blueprints.blueprint_rank'
            }, this.state.blueprint.rank, onChange));

            const publicToggle = toggle({
                name: 'public',
                label: 'fred.fe.blueprints.blueprint_public'
            }, this.state.blueprint.public, onChange);

            if (!fredConfig.permission.fred_blueprints_create_public) {
                publicToggle.inputEl.setAttribute('disabled', 'disabled');
            }

            const templates = MultiSelect({
                name: 'templates',
                label: fredConfig.lng('fred.fe.blueprints.templates')
            }, getTemplates, onChangeTemplates);

            templates.querySelector('.fred--tagger_input_wrapper').appendChild(div('fred--tagger_description', 'fred.fe.blueprints.current_note'));

            fields.appendChild(publicToggle);
            fields.appendChild(templates);

            const createButton = button('fred.fe.blueprints.create_blueprint', 'fred.fe.blueprints.create_blueprint', ['fred--btn-panel', 'fred--btn-apply'], () => {
                emitter.emit('fred-loading', fredConfig.lng('fred.fe.blueprints.creating_blueprint'));

                createBlueprint(
                    this.state.blueprint.name,
                    this.state.blueprint.description,
                    this.state.blueprint.category,
                    this.state.blueprint.rank,
                    this.state.blueprint.public,
                    fredConfig.fred.getContent(true),
                    this.state.blueprint.generatedImage,
                    true,
                    this.state.blueprint.templates
                )
                    .then(json => {
                        cache.killNamespace('blueprints');
                        this.click().then(newContent => {
                            content.replaceWith(newContent);
                            drake.reloadContainers();
                            emitter.emit('fred-loading-hide');
                        });
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

            fields.appendChild(createButton);

            this.pageForm.appendChild(fields);

            this.createBlueprintButton.classList.add('active');
            e.stopPropagation();
            emitter.emit('fred-sidebar-dt-active', this.createBlueprintButton, this.formWrapper);
        }
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

    buildCreateCategory(content) {
        const formWrapper = dd();

        const pageForm = form(['fred--pages_create']);

        const fields = fieldSet();
        const title = legend('fred.fe.blueprints.create_category');

        const onChange = (name, value) => {
            this.state.category[name] = value;
        };

        const onChangeTemplates = (tags) => {
            this.state.category.templates = tags.reduce(
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

        fields.appendChild(title);

        const name = text({
            name: 'name',
            label: 'fred.fe.blueprints.category_name'
        }, this.state.category.name, onChange);

        const rank = text({
            name: 'rank',
            label: 'fred.fe.blueprints.category_rank'
        }, this.state.category.rank, onChange);


        const templates = MultiSelect({
            name: 'templates',
            label: fredConfig.lng('fred.fe.blueprints.templates')
        }, getTemplates, onChangeTemplates);

        templates.querySelector('.fred--tagger_input_wrapper').appendChild(div('fred--tagger_description', 'fred.fe.blueprints.current_note'));

        const publicToggle = toggle({
            name: 'public',
            label: 'fred.fe.blueprints.category_public'
        }, this.state.category.public, onChange);

        if (!fredConfig.permission.fred_blueprint_categories_create_public) {
            publicToggle.inputEl.setAttribute('disabled', 'disabled');
        }

        fields.appendChild(name);
        fields.appendChild(rank);
        fields.appendChild(publicToggle);
        fields.appendChild(templates);

        const createButton = button('fred.fe.blueprints.create_category', 'fred.fe.blueprints.create_category', ['fred--btn-panel', 'fred--btn-apply'], () => {
            emitter.emit('fred-loading', fredConfig.lng('fred.fe.blueprints.creating_blueprint_category'));

            createBlueprintCategory(this.state.category.name, this.state.category.rank, +this.state.category.public, this.state.category.templates)
                .then(json => {
                    cache.killNamespace('blueprints');
                    this.state.blueprint.category = null;
                    this.click().then(newContent => {
                        content.replaceWith(newContent);
                        drake.reloadContainers();
                        emitter.emit('fred-loading-hide');
                    });
                })
                .catch(err => {
                    if (err.response && err.response._fields && err.response._fields.name) {
                        name.onError(err.response._fields.name);

                        emitter.emit('fred-loading-hide');
                    }
            });
        });

        fields.appendChild(createButton);

        pageForm.appendChild(fields);

        const createPageButton = dt('fred.fe.blueprints.create_category', ['fred--accordion-cog','margin-top:12px'], (e, el) => {
            const activeTabs = content.querySelectorAll('dt.active');

            const isActive = el.classList.contains('active');

            for (let tab of activeTabs) {
                tab.classList.remove('active');
            }

            if (!isActive) {
                el.classList.add('active');
                e.stopPropagation();
                emitter.emit('fred-sidebar-dt-active', createPageButton, formWrapper);
            }
        });

        formWrapper.appendChild(pageForm);

        content.appendChild(createPageButton);
        content.appendChild(formWrapper);
    }

    afterExpand() {
        drake.reloadContainers();
    }

    collapse() {
        if (this.pasteHandler !== null) {
            document.removeEventListener('paste', this.pasteHandler);
        }
        this.titleEl.classList.remove('active');
    }
}
