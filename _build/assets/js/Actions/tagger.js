import cache from "../Cache";
import fetch from '../Fetch';
import fredConfig from "../Config";
import {errorHandler} from "../Utils";

export const getGroups = (group, autoTag) => {
    return cache.load('tagger', {name: 'groups', group, autoTag}, () => {
        return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?modx=${fredConfig.config.modxVersion}&action=tagger-get-group&group=${group}&includeTags=${autoTag | 0}`)
            .then(errorHandler)
            .then(json => {
                return json.data.group.tags;
            })
    });
};

export const getTags = (group, query = null) => {
    let queryString = `&group=${group}`;

    if (query !== null) {
        queryString += `&query=${query}`;
    }

    return cache.load('tagger', {name: 'tags', group, query}, () => {
        return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?modx=${fredConfig.config.modxVersion}&action=tagger-get-tags&${queryString}`)
            .then(errorHandler)
            .then(json => {
                return json.data.tags;
            });
    });
};
