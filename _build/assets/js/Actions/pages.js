import cache from "../Cache";
import fetch from '../Fetch';
import fredConfig from "../Config";
import {errorHandler} from "../Utils";

export const getResourceTree = contextKey => {
    return cache.load('resources', {name: 'resource-tree'}, () => {
        return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=get-resource-tree&context=${contextKey}`)
            .then(response => {
                return response.json();
            }).then(response => {
                return response.data.resources;
            });
    });
};

export const getTemplates = contextKey => {
    return cache.load('templates', {name: 'templates'}, () => {
        return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=get-templates`)
            .then(errorHandler);
    });
};

export const createResource = (parent, template, pagetitle, blueprint, published = null, hidemenu = null) => {
    return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=create-resource`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parent,
            template,
            pagetitle,
            blueprint,
            published,
            hidemenu,
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

    return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=get-resources${queryString}`).then(errorHandler)
};

export const publishResource = resource => {
    return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=publish-resource`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            resource
        })
    }).then(errorHandler)
};

export const unpublishResource = resource => {
    return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=unpublish-resource`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            resource
        })
    }).then(errorHandler)
};

export const deleteResource = resource => {
    return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=delete-resource`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            resource
        })
    }).then(errorHandler)
};

export const undeleteResource = resource => {
    return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=undelete-resource`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            resource
        })
    }).then(errorHandler)
};

export const duplicateResource = (pagetitle, duplicate_children, publishing_options, resource) => {
    return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=duplicate-resource`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pagetitle,
            duplicate_children,
            publishing_options,
            resource
        })
    }).then(errorHandler)
};
