import fetch from "isomorphic-fetch";
import cache from '../Cache';
import fredConfig from "../Config";

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