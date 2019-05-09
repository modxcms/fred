import fetch from '../Fetch';
import cache from '../Cache';
import fredConfig from "../Config";
import { errorHandler } from "../Utils";

export const getElements = () => {
    return cache.load('elements', {name: 'elements'}, () => {
        return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=get-elements&theme=${fredConfig.config.theme}`)
            .then(response => {
                return response.json();
            }).then(response => {
                return response.data;
            });
    });
};

export const renderElement = (element, settings, parseModx, cacheOutput, refreshCache) => {
    return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=render-element`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            resource: fredConfig.resource.id,
            parseModx,
            element,
            settings,
            cacheOutput,
            refreshCache
        })
    }).then(errorHandler)
};

export const replaceImage = (element, image) => {
    const body = {
        element,
        image
    };

    if (image === '') {
        body.generatedImage = generatedImage;
    }

    return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=element-replace-image`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(errorHandler);
};