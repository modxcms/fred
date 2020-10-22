import cache from '../Cache';
import fetch from '../Fetch';
import fredConfig from "@fred/Config";

export const getTemplates = (query?: string): Promise<{id: number; value: number|string; label: string}[]> => {
    return cache.load('theme', {name: 'templates', theme: fredConfig.config.theme, query}, () => {
        const queryString = (query) ? `&query=${query}` : '';
        return fetch(`${fredConfig.config.assetsUrl}endpoints/ajax.php?action=get-themed-templates${queryString}`)
            .then(response => {
                return response.json();
            })
            .then(response => {
                return response.data.templates;
            });
    });
};
