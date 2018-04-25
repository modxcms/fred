import fredEditors from './Editors';

class Config {
    constructor() {
        this._config = {};
        this._editors = fredEditors;
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
}

const config = new Config();

export default config;