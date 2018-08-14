import fetch from "isomorphic-fetch";
import cache from '../Cache';
import { errorHandler } from "../Utils";
import fredConfig from "../Config";

export const getBlueprints = (complete = null) => {
    return cache.load('blueprints', {name: 'blueprints', complete}, () => {
        const completeString = (complete !== null) ? `&complete=${+complete}` : '';
        
        return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=get-blueprints&theme=${fredConfig.config.theme}${completeString}`, {
            credentials: 'same-origin'
        })
            .then(response => {
                return response.json();
            })
            .then(response => {
                return response.data.blueprints;
            });
    });
};

export const createBlueprint = (name, description, category, rank, isPublic, data, generatedImage, image, complete) => {
    const body = {
        name,
        description,
        category,
        rank,
        public: isPublic,
        data,
        generatedImage: '',
        image,
        complete
    };

    if (image === '') {
        body.generatedImage = generatedImage;
    }

    return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=blueprints-create-blueprint`, {
        method: "post",
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(errorHandler);
};

export const createBlueprintCategory = (name, rank, isPublic) => {
    return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=blueprints-create-category`, {
        method: "post",
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            rank,
            public: isPublic,
            theme: fredConfig.config.theme
        })
    }).then(errorHandler);
};

export const loadBlueprint = blueprint => {
    return cache.load('blueprints', {name: 'load-blueprint', blueprint}, () => {
        return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=load-blueprint&blueprint=${blueprint}`, {
            credentials: 'same-origin'
        })
            .then(errorHandler)
            .catch(err => {
                console.log(err);
            });
    }); 
};