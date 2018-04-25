import modxlink from './Plugins/modxlink/modxlink';
import fredConfig from '../Config';

const registerTineMCEPlugins = fred => {
    tinymce.PluginManager.add('modxlink', modxlink(fred, fredConfig));
};

export default registerTineMCEPlugins;