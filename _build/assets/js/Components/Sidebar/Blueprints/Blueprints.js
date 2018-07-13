import Sidebar from '../../Sidebar';
import emitter from '../../../EE';
import {dd, dl, dt, form, fieldSet, legend, div, button, figCaption, figure, img} from '../../../UI/Elements';
import {choices, text, toggle, image} from "../../../UI/Inputs";
import fredConfig from "../../../Config";
import cache from '../../../Cache';
import hoverintent from "hoverintent";
import drake from "../../../Drake";
import html2canvas from 'html2canvas';
import { getBlueprints, createBlueprint, createBlueprintCategory } from '../../../Actions/blueprints';

export default class Blueprints extends Sidebar {
    static title = 'fred.fe.blueprints';
    static icon = 'fred--sidebar_blueprints';
    static expandable = true;

    init() {
        this.categories = [];
        
        this.state = {
            category: {
                name: '',
                rank: '',
                public: true
            },
            blueprint: {
                name: '',
                category: null,
                rank: '',
                public: true,
                image: '',
                generatedImage: ''
            }
        };
    }

    click() {
        return getBlueprints().then(value => {
            return this.buildPanel(value);
        });
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
        this.buildCreateCategory(content);
        this.buildCreateBlueprint(content);

        return content;
    }

    buildCreateCategory(content) {
        const formWrapper = dd();

        const pageForm = form(['fred--pages_create']);

        const fields = fieldSet();
        const title = legend('fred.fe.blueprints.create_category');

        const onChange = (name, value) => {
            this.state.category[name] = value;
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
        
        const publicToggle = toggle({
            name: 'public',
            label: 'fred.fe.blueprints.category_public'
        }, this.state.category.public, onChange);

        fields.appendChild(name);
        fields.appendChild(rank);
        fields.appendChild(publicToggle);

        const createButton = button('fred.fe.blueprints.create_category', 'fred.fe.blueprints.create_category', ['fred--btn-panel', 'fred--btn-apply'], () => {
            emitter.emit('fred-loading', fredConfig.lng('fred.fe.blueprints.creating_blueprint_category'));

            createBlueprintCategory(this.state.category.name, this.state.category.rank, +this.state.category.public)
                .then(json => {
                    cache.kill('blueprints', {name: 'blueprints'});
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

        const createPageButton = dt('fred.fe.blueprints.create_category', ['fred--accordion-plus'], (e, el) => {
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

    buildCreateBlueprint(content) {
        const formWrapper = dd();

        const pageForm = form(['fred--pages_create']);

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

        const onImageChange = (name, value) => {
            if (value === '') {
                imageEl.setPreview(this.state.blueprint.generatedImage);
            }

            this.state.blueprint[name] = value;
        };

        const imageEl = image({
            name: 'image',
            label: 'fred.fe.blueprints.blueprint_image'
        }, this.state.blueprint.image, onImageChange);

        fields.appendChild(imageEl);
        
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

        fields.appendChild(toggle({
            name: 'public',
            label: 'fred.fe.blueprints.blueprint_public'
        }, this.state.blueprint.public, onChange));

        if (this.state.blueprint.image === '') {
            html2canvas(document.body, {
                logging: false,
                ignoreElements: el => {
                    if (el.classList.contains('fred')) return true;
                    if (el.classList.contains('fred--toolbar')) return true;
    
                    return false;
                }
            }).then(canvas => {
                this.state.blueprint.generatedImage = canvas.toDataURL();
                imageEl.setPreview(this.state.blueprint.generatedImage);
            });
        }
        
        
        const createButton = button('fred.fe.blueprints.create_blueprint', 'fred.fe.blueprints.create_blueprint', ['fred--btn-panel', 'fred--btn-apply'], () => {
            emitter.emit('fred-loading', fredConfig.lng('fred.fe.blueprints.creating_blueprint'));

            createBlueprint(this.state.blueprint.name, this.state.blueprint.category, this.state.blueprint.rank, this.state.blueprint.public, fredConfig.fred.getContent(), this.state.blueprint.generatedImage, this.state.blueprint.image, true)
                    .then(json => {
                        cache.kill('blueprints', {name: 'blueprints'});
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

        pageForm.appendChild(fields);

        const createPageButton = dt('fred.fe.blueprints.create_blueprint', ['fred--accordion-plus'], (e, el) => {
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
}