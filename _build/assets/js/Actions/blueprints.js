import cache from '../Cache';
import fetch from '../Fetch';
import { errorHandler } from "../Utils";
import fredConfig from "../Config";

export const getBlueprints = (complete = null, theme = fredConfig.config.theme) => {
    return cache.load('blueprints', {name: 'blueprints', complete, theme}, () => {
        const completeString = (complete !== null) ? `&complete=${+complete}` : '';
        return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=get-blueprints&theme=${theme}${completeString}`)
            .then(response => {
                return response.json();
            })
            .then(response => {
                return response.data.blueprints;
            });
    });
};

export const createBlueprint = (name, description, category, rank, isPublic, data, generatedImage, image, complete, templates) => {
    const body = {
        name,
        description,
        category,
        rank,
        public: isPublic,
        data,
        generatedImage: '',
        image,
        complete,
        templates
    };

    if (image === '') {
        body.generatedImage = generatedImage;
    }

    return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=blueprints-create-blueprint`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(errorHandler);
};

export const createBlueprintCategory = (name, rank, isPublic, templates) => {
    console.log({name, rank, isPublic, templates});
    return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=blueprints-create-category`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            rank,
            public: isPublic,
            theme: fredConfig.config.theme,
            templates
        })
    }).then(errorHandler);
};

export const loadBlueprint = blueprint => {
    return cache.load('blueprints', {name: 'load-blueprint', blueprint}, () => {
        return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=load-blueprint&blueprint=${blueprint}`)
            .then(errorHandler)
            .catch(err => {
                console.log(err);
            });
    });
};
