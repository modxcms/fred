import fetch from "isomorphic-fetch";
import cache from '../Cache';
import { errorHandler } from "../Utils";
import fredConfig from "../Config";
import emitter from "../EE";
import drake from "../Drake";

export const getBlueprints = () => {
    return cache.load('blueprints', {name: 'blueprints'}, () => {
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
};

export const createBlueprint = (name, category, rank, isPublic, data, generatedImage, image, complete) => {
    const body = {
        name,
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
            public: isPublic
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