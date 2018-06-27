import jsSHA from 'jssha';

class Cache {
    constructor() {
        this._cache = {};
    }

    _setValue(namespace, name, value, expires) {
        if (!this._cache[namespace]) this._cache[namespace] = {};
        if (!this._cache[namespace][name]) this._cache[namespace][name] = {};

        this._cache[namespace][name]['value'] = value;
        this._cache[namespace][name]['expires'] = expires;
    }
    
    load(namespace, properties, loadFn, expires = 300) {
        const shaObj = new jsSHA("SHA-256", "TEXT");
        shaObj.update(JSON.stringify(properties));
        const name = shaObj.getHash('HEX');
        
        const now = Math.floor(Date.now() / 1000);
        
        if (this._cache[namespace] && this._cache[namespace][name] && (this._cache[namespace][name]['expires'] > now)) {
            return Promise.resolve(this._cache[namespace][name]['value']);
        }

        return Promise.resolve(loadFn()).then(value => {
            this._setValue(namespace, name, value, now + expires);
            return value;
        });
    }
    
    kill(namespace, properties) {
        const shaObj = new jsSHA("SHA-256", "TEXT");
        shaObj.update(JSON.stringify(properties));
        const name = shaObj.getHash('HEX');

        if (this._cache[namespace] && this._cache[namespace][name]) {
            delete this._cache[namespace][name];
        }
    }
}

const cache = new Cache();

export default cache;