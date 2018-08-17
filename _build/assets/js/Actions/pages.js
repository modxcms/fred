import cache from "../Cache";
import fetch from "isomorphic-fetch";
import fredConfig from "../Config";
import {errorHandler} from "../Utils";

export const getResourceTree = contextKey => {
    return cache.load('resources', {name: 'resource-tree'}, () => {
        return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=get-resource-tree&context=${contextKey}`, {
            credentials: 'same-origin'
        })
            .then(response => {
                return response.json();
            }).then(response => {
                return response.data.resources;
            });
    });
};

export const getTemplates = contextKey => {
    return cache.load('templates', {name: 'templates'}, () => {
        return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=get-templates`, {
            credentials: 'same-origin'
        })
            .then(errorHandler);
    });
};

export const createResource = (parent, template, pagetitle, blueprint) => {
    return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=create-resource`, {
        method: "post",
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parent,
            template,
            pagetitle,
            blueprint,
            contextKey: fredConfig.config.contextKey
        })
    }).then(errorHandler)
};

export const getResources = (currentResource = null, query = {}) => {
    let queryString = '';
    
    if (currentResource !== null) {
        queryString += `&current=${currentResource}`;
    }
    
    for (let key in query) {
        if (query.hasOwnProperty(key)) {
            queryString += `&${key}=${query[key]}`;
        }
    }
    
    return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=get-resources${queryString}`, {
        credentials: 'same-origin'
    }).then(errorHandler)
};