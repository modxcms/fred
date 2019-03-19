import fredEditors from './Editors';

class Config {
    constructor() {
        this._config = {};
        this._editors = fredEditors;
        this._rtes = {};
        this._sidebarPlugins = {};
        this._pluginsData = {};
        this._pageSettings = {};
        this._tagger = [];
        this._tvs = [];
        this._lang = {};
        this._fred = null;
        this._jwt = null;
        this._permission = null;
        this._resource = null;
        this._invalidElements = false;
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
    
    set permission(permission) {
        if (this._permission === null) {
            this._permission = permission;
            Object.freeze(this._permission);
        }
    }
    
    set resource(resource) {
        if (this._resource=== null) {
            this._resource = resource;
            Object.freeze(this._resource);
        }
    }
    
    set lang(lang) {
        this._lang = lang;
    }
    
    set invalidElements(invalidElements) {
        this._invalidElements = invalidElements;
    }
    
    set pluginsData(pluginsData) {
        this._pluginsData = pluginsData;
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
    
    get sidebarPlugins() {
        return this._sidebarPlugins;
    }
    
    get pluginsData() {
        return this._pluginsData;
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
    
    get permission() {
        return this._permission;
    }
    
    get resource() {
        return this._resource;
    }
    
    get invalidElements() {
        return this._invalidElements;
    }
    
    getPluginsData(namespace, name) {
        if (this._pluginsData[namespace] && (this._pluginsData[namespace][name] !== undefined)) {
            return this._pluginsData[namespace][name];
        }
        
        return null;
    }

    setPluginsData(namespace, name, value) {
        if (!this._pluginsData[namespace]) this._pluginsData[namespace] = {};
        this._pluginsData[namespace][name] = value;
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

    registerSidebarPlugin(name, pluginClass) {
        if (!this._sidebarPlugins[name]) {
            this._sidebarPlugins[name] = pluginClass;
            return true;
        } else {
            console.log(`Sidebar Plugin "${name}" is already registered`);
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