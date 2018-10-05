import fredEditors from './Editors';

class Config {
    constructor() {
        this._config = {};
        this._editors = fredEditors;
        this._rtes = {};
        this._pageSettings = {};
        this._tagger = [];
        this._tvs = [];
        this._lang = {};
        this._fred = null;
        this._jwt = null;
    }
    
    set fred(fred) {
        this._fred = fred;
    }
    
    set config(config) {
        this._config = config;
    }
    
    set pageSettings(pageSettings) {
        this._pageSettings = pageSettings;
    }
    
    set tagger(tagger) {
        this._tagger = tagger;
    }
    
    set tvs(tvs) {
        this._tvs = tvs;
    }
    
    set jwt(jwt) {
        if (this._jwt === null) {
            this._jwt = jwt;
        }
    }
    
    set lang(lang) {
        this._lang = lang;
    }

    get config() {
        return this._config;
    }

    get editors() {
        return this._editors;
    }
    
    get rtes() {
        return this._rtes;
    }
    
    get pageSettings() {
        return this._pageSettings;
    }
    
    get fred() {
        return this._fred;
    }
    
    get tagger() {
        return this._tagger;
    }
    
    get tvs() {
        return this._tvs;
    }
    
    get jwt() {
        return this._jwt;
    }

    registerEditor(name, editor) {
        if (!this._editors[name]) {
            this._editors[name] = editor;
            return true;
        } else {
            console.log(`Editor "${name}" is already registered`);
            return false;
        }
    }

    registerRTE(name, rteInit) {
        if (!this._rtes[name]) {
            this._rtes[name] = rteInit;
            return true;
        } else {
            console.log(`RTE "${name}" is already registered`);
            return false;
        }
    }
    
    lng(key, params) {
        if (this._lang[key] === undefined) {
            console.log(`[FRED] Language string: ${key} not found`);
            return '';
        }
        
        if (params && (typeof params === 'object')) {
            let translation = "" + this._lang[key];
            for (let key in params) {
                if (params.hasOwnProperty(key)) {
                    translation = translation.replace(`[[+${key}]]`, params[key]);
                }
            }
            
            return translation;
        }
        
        return this._lang[key];
    }
    
    lngExists(key) {
        return this._lang[key] !== undefined;
    }
}

const config = new Config();

export default config;