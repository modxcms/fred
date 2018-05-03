import fredEditors from './Editors';

class Config {
    constructor() {
        this._config = {};
        this._editors = fredEditors;
        this._rtes = {};
        this._pageSettings = {};
    }
    
    set config(config) {
        this._config = config;
    }
    
    set pageSettings(pageSettings) {
        this._pageSettings= pageSettings;
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
}

const config = new Config();

export default config;