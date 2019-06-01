import SidebarPlugin from '../../SidebarPlugin';
import emitter from '../../../EE';
import {dd, dl, dt, form, fieldSet, legend, div, button, figCaption, figure, img, span} from '../../../UI/Elements';
import {choices, text, toggle, image, area} from "../../../UI/Inputs";
import fredConfig from "../../../Config";
import cache from '../../../Cache';
import hoverintent from "hoverintent";
import drake from "../../../Drake";
import html2canvas from 'html2canvas';
import { getBlueprints, createBlueprint, createBlueprintCategory } from '../../../Actions/blueprints';

export default class Blueprints extends SidebarPlugin {
    static title = 'fred.fe.blueprints';
    static icon = 'fred--sidebar_blueprints';
    static expandable = true;

    init() {
        this.categories = [];
        
        this.state = {
            category: {
                name: '',
                rank: '',
                public: !!fredConfig.permission.fred_blueprint_categories_create_public
            },
            blueprint: {
                name: '',
                description: '',
                category: null,
                rank: '',
                public: !!fredConfig.permission.fred_blueprints_create_public,
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
        const formWrapper = dd();

        const pageForm = form(['fred--pages_create']);

        const createPageButton = dt('fred.fe.blueprints.create_blueprint', ['fred--accordion-cog'], (e, el) => {
            const activeTabs = content.querySelectorAll('dt.active');

            const isActive = el.classList.contains('active');

            for (let tab of activeTabs) {
                tab.classList.remove('active');
            }

            if (!isActive) {
                pageForm.innerHTML = '';
                
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

                const publicToggle = toggle({
                    name: 'public',
                    label: 'fred.fe.blueprints.blueprint_public'
                }, this.state.blueprint.public, onChange);

                if (!fredConfig.permission.fred_blueprints_create_public) {
                    publicToggle.inputEl.setAttribute('disabled', 'disabled');
                }

                fields.appendChild(publicToggle);

                if (this.state.blueprint.image === '') {
                    const loader = span(['fred--loading']);
                    imageEl.appendChild(loader);

                    fredConfig.fred.previewContent().then(iframe => {
                        iframe.parentNode.style.display = 'block';
                        iframe.parentNode.style.opacity = '0';
                        iframe.parentNode.style.zIndex = '-99999999';

                        html2canvas(iframe.contentWindow.document.body, {
                            logging: false
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

                                    this.state.blueprint.generatedImage = resizedCanvas.toDataURL();
                                    loader.remove();
                                    imageEl.setPreview(this.state.blueprint.generatedImage);

                                    iframe.parentNode.style.display = 'none';
                                    iframe.parentNode.style.opacity = null;
                                    iframe.parentNode.style.zIndex = null;
                                };

                                image.src = canvas.toDataURL();
                            } else {
                                this.state.blueprint.generatedImage = canvas.toDataURL();
                                loader.remove();
                                imageEl.setPreview(this.state.blueprint.generatedImage);

                                iframe.parentNode.style.display = 'none';
                                iframe.parentNode.style.opacity = null;
                                iframe.parentNode.style.zIndex = null;
                            }
                        })
                        .catch(err => {
                            iframe.parentNode.style.display = 'none';
                            iframe.parentNode.style.opacity = null;
                            iframe.parentNode.style.zIndex = null;
                            loader.remove();

                            imageEl.setPreview('https://via.placeholder.com/300x150/000000/FF0000?text=Generation%20Failed');
                        });
                    });
                }

                const createButton = button('fred.fe.blueprints.create_blueprint', 'fred.fe.blueprints.create_blueprint', ['fred--btn-panel', 'fred--btn-apply'], () => {
                    emitter.emit('fred-loading', fredConfig.lng('fred.fe.blueprints.creating_blueprint'));

                    createBlueprint(this.state.blueprint.name, this.state.blueprint.description, this.state.blueprint.category, this.state.blueprint.rank, this.state.blueprint.public, fredConfig.fred.getContent(), this.state.blueprint.generatedImage, this.state.blueprint.image, true)
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

                pageForm.appendChild(fields);
                
                el.classList.add('active');
                e.stopPropagation();
                emitter.emit('fred-sidebar-dt-active', createPageButton, formWrapper);
            }
        });

        formWrapper.appendChild(pageForm);

        content.appendChild(createPageButton);
        content.appendChild(formWrapper);
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
        
        if (!fredConfig.permission.fred_blueprint_categories_create_public) {
            publicToggle.inputEl.setAttribute('disabled', 'disabled');
        }

        fields.appendChild(name);
        fields.appendChild(rank);
        fields.appendChild(publicToggle);

        const createButton = button('fred.fe.blueprints.create_category', 'fred.fe.blueprints.create_category', ['fred--btn-panel', 'fred--btn-apply'], () => {
            emitter.emit('fred-loading', fredConfig.lng('fred.fe.blueprints.creating_blueprint_category'));

            createBlueprintCategory(this.state.category.name, this.state.category.rank, +this.state.category.public)
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
}