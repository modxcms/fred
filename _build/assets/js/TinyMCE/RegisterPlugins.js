import modxlink from './Plugins/modxlink/modxlink';

const registerPlugins = fred => {
    tinymce.PluginManager.add('modxlink', modxlink(fred));

};

export default registerPlugins;