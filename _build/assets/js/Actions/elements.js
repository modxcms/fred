import fetch from "isomorphic-fetch";
import cache from '../Cache';
import fredConfig from "../Config";
import { errorHandler } from "../Utils";

export const getElements = () => {
    return cache.load('elements', {name: 'elements'}, () => {
        return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=get-elements`, {
            credentials: 'same-origin'
        })
            .then(response => {
                return response.json();
            }).then(response => {
                return response.data;
            });
    });
};

export const renderElement = (element, settings, parseModx) => {
    return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=render-element`, {
        method: "post",
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            resource: fredConfig.config.resource.id,
            parseModx,
            element,
            settings
        })
    }).then(errorHandler)
};