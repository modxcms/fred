import fredConfig from "../Config";
import fetch from '../Fetch';
import {errorHandler} from "../Utils";

export const getPreview = () => {
    return fetch(fredConfig.resource.previewUrl).then(response => {
        return response.text();
    })
};

export const saveContent = body => {
    if(!fredConfig.permission.save_document){
        return Promise.reject(new Error());
    }
    
    return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=save-content`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(errorHandler);
};

export const fetchContent = () => {
    return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=load-content&id=${fredConfig.resource.id}`).then(response => {
        return response.json();
    })
};

export const fetchLexicons = topics => {
    return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=load-lexicons${topics}`, {
        method: "get",
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json();
    });
};
