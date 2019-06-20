import utilitySidebar from './../../UtilitySidebar';
import {choices, image, text, toggle} from "../../../UI/Inputs";
import {button, div, fieldSet, form, img, legend, span} from "../../../UI/Elements";
import cache from "../../../Cache";
import emitter from "../../../EE";
import fredConfig from "../../../Config";
import html2canvas from "html2canvas";
import { getBlueprints, createBlueprint } from '../../../Actions/blueprints';

export class PartialBlueprints {
    open(el) {
        this.el = el;
        this.categories = [];

        this.state = {
            name: '',
            category: null,
            rank: '',
            public: !!fredConfig.permission.fred_blueprints_create_public,
            image: '',
            description: '',
            generatedImage: ''
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

        const onImageChange = (name, value) => {
            if (value === '') {
                imageEl.setPreview(this.state.generatedImage);
            }

            this.state[name] = value;
        };

        const imageEl = image({
            name: 'image',
            label: 'fred.fe.blueprints.blueprint_image'
        }, this.state.image, onImageChange);

        fields.appendChild(imageEl);

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

        if (this.state.image === '') {
            const loader = span(['fred--loading']);
            imageEl.appendChild(loader);

            html2canvas(this.el.wrapper, {
                logging: false,
                ignoreElements: el => {
                    if (el.classList.contains('fred')) return true;
                    if (el.classList.contains('fred--toolbar')) return true;
                    if (el.classList.contains('fred--block_title')) return true;

                    return false;
                }
            }).then(canvas => {
                const maxWidth = 540;

                if (canvas.width > maxWidth) {
                    const ratio = maxWidth / canvas.width;
                    const image = new Image();

                    image.onload = () => {
                        const resizedCanvas = document.createElement("canvas");
                        const ctx = resizedCanvas.getContext("2d");

                        resizedCanvas.width = canvas.width * ratio;
                        resizedCanvas.height = canvas.height * ratio;

                        ctx.drawImage(image, 0, 0, resizedCanvas.width, resizedCanvas.height);

                        this.state.generatedImage = resizedCanvas.toDataURL();
                        loader.remove();
                        imageEl.setPreview(this.state.generatedImage);
                    };

                    image.src = canvas.toDataURL();
                } else {
                    this.state.generatedImage = canvas.toDataURL();
                    loader.remove();
                    imageEl.setPreview(this.state.generatedImage);
                }
            })
            .catch(err => {
                loader.remove();
                imageEl.setPreview('https://via.placeholder.com/300x150/000000/FF0000?text=Generation%20Failed');
            });
        }

        const createButton = button('fred.fe.blueprints.create_blueprint', 'fred.fe.blueprints.create_blueprint', ['fred--btn-panel', 'fred--btn-apply'], () => {
            emitter.emit('fred-loading', fredConfig.lng('fred.fe.blueprints.creating_blueprint'));

            createBlueprint(this.state.name, this.state.description, this.state.category, this.state.rank, this.state.public, [this.el.getContent()], this.state.generatedImage, this.state.image, false)
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
        });

        const buttonGroup = div(['fred--panel_button_wrapper']);
        buttonGroup.appendChild(createButton);
        buttonGroup.appendChild(cancelButton);
        fields.appendChild(buttonGroup);

        pageForm.appendChild(fields);

        return pageForm;
    }
}

const partialBlueprints = new PartialBlueprints();
export default partialBlueprints;
