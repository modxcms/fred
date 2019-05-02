import fredConfig from "./Config";
import fetchDefaults from "fetch-defaults";
import isomorphicFetch from "isomorphic-fetch";

let defaultedFetch = null;

export default (...args) => {
    if (defaultedFetch === null) {
        defaultedFetch = fetchDefaults(isomorphicFetch, {
            credentials: 'same-origin',
            headers: {
                'X-Fred-Token': fredConfig.jwt
            }
        });
    }
    
    return defaultedFetch(...args);
}