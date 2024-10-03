import fredEditors from './Editors';

class Config {
    constructor() {
        this._config = {};
        this._editors = fredEditors;
        this._rtes = {};
        this._sidebarPlugins = {};
        this._toolbarPlugins = {};
        this._pluginsData = {};
        this._pageSettings = {};
        this._themeSettings = {};
        this._indexedThemeSettings = {};
        this._themeSettingsCache = null;
        this._tagger = [];
        this._tvs = [];
        this._lang = {};
        this._fred = null;
        this._jwt = null;
        this._modxVersion = null;
        this._permission = null;
        this._resource = null;
        this._invalidElements = false;
        this._sidebar = null;
        this._launcher = null;
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

    set themeSettings(themeSettings) {
        this._themeSettings = themeSettings;
        this._themeSettingsCache = null;
        for (const setting of this._themeSettings) {
            if (setting['group'] !== undefined && setting['settings'] !== undefined) {
                for (const groupSetting of setting['settings']) {
                    this._indexedThemeSettings[groupSetting['name']] = groupSetting;
                }
                continue;
            }

            this._indexedThemeSettings[setting['name']] = setting;
        }
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

    set modxVersion(modxVersion) {
        if (this._modxVersion === null) {
            this._modxVersion = modxVersion;
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

    set sidebar(sidebar) {
        if (this._sidebar=== null) {
            this._sidebar = sidebar;
        }
    }

    set launcher(launcher) {
        if (this._launcher=== null) {
            this._launcher = launcher;
        }
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

    get toolbarPlugins() {
        return this._toolbarPlugins;
    }

    get pluginsData() {
        return this._pluginsData;
    }

    get pageSettings() {
        return this._pageSettings;
    }

    get themeSettings() {
        return this._themeSettings;
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

    get modxVersion() {
        return this._modxVersion;
    }

    get permission() {
        return this._permission;
    }

    get resource() {
        return this._resource;
    }

    get sidebar() {
        return this._sidebar;
    }

    get launcher() {
        return this._launcher;
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

    registerToolbarPlugin(name, pluginClass) {
        if (!this._toolbarPlugins[name]) {
            this._toolbarPlugins[name] = pluginClass;
            return true;
        } else {
            console.log(`Toolbar Plugin "${name}" is already registered`);
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

    themeSettingsExists(name) {
        return this._indexedThemeSettings[name] !== undefined;
    }

    getThemeSettingValue(name) {
        return this._indexedThemeSettings[name]?.value || undefined;
    }

    setThemeSettingValue(name, value) {
        if (!this._indexedThemeSettings[name]) return;

        this._themeSettingsCache = null;
        this._indexedThemeSettings[name].value = value;
    }

    getThemeSettingsMap() {
        if (this._themeSettingsCache !== null) {
            return this._themeSettingsCache;
        }

        this._themeSettingsCache = Object.values(this._indexedThemeSettings).reduce((acc, item) => {
            acc['setting'][item.name] = item.value;
            return acc;
        }, {setting: {}});

        return this._themeSettingsCache;
    }
}

const config = new Config();

export default config;
