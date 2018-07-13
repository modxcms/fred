import utilitySidebar from './../../UtilitySidebar';
import {choices, image, text, toggle} from "../../../UI/Inputs";
import {button, div, fieldSet, form, legend} from "../../../UI/Elements";
import fetch from "isomorphic-fetch";
import {errorHandler} from "../../../Utils";
import cache from "../../../Cache";
import emitter from "../../../EE";
import fredConfig from "../../../Config";
import html2canvas from "html2canvas";

export class PartialBlueprints {
    open(el) {
        this.el = el;
        this.categories = [];

        this.state = {
            name: '',
            category: null,
            rank: '',
            public: true,
            image: '',
            generatedImage: ''
        };

        const blueprints = cache.load('blueprints', {name: 'blueprints'}, () => {
            return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=get-blueprints`, {
                credentials: 'same-origin'
            })
                .then(response => {
                    return response.json();
                })
                .then(response => {
                    return response.data.blueprints;
                });
        });

        blueprints.then(value => {
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

        fields.appendChild(toggle({
            name: 'public',
            label: 'fred.fe.blueprints.blueprint_public'
        }, this.state.public, onChange));

        if (this.state.image === '') {
            html2canvas(this.el.wrapper, {
                logging: false,
                ignoreElements: el => {
                    if (el.classList.contains('fred')) return true;
                    if (el.classList.contains('fred--toolbar')) return true;

                    return false;
                }
            }).then(canvas => {
                this.state.generatedImage = canvas.toDataURL();
                imageEl.setPreview(this.state.generatedImage);
            });
        }

        const createButton = button('fred.fe.blueprints.create_blueprint', 'fred.fe.blueprints.create_blueprint', ['fred--btn-panel', 'fred--btn-apply'], () => {
            emitter.emit('fred-loading', fredConfig.lng('fred.fe.blueprints.creating_blueprint'));

            const body = {
                name: this.state.name,
                category: this.state.category,
                rank: this.state.rank,
                public: this.state.public,
                data: [this.el.getContent()],
                generatedImage: '',
                image: this.state.image,
                complete: false
            };

            if (this.state.image === '') {
                body.generatedImage = this.state.generatedImage;
            }

            fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=blueprints-create-blueprint`, {
                method: "post",
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then(errorHandler)
                .then(json => {
                    cache.kill('blueprints', {name: 'blueprints'});
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