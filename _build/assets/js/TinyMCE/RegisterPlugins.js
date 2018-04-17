import modxlink from './Plugins/modxlink/modxlink';

const registerTineMCEPlugins = fred => {
    tinymce.PluginManager.add('modxlink', modxlink(fred));

};

export default registerTineMCEPlugins;