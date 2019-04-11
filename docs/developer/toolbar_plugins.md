# Toolbar Plugins

## Init function
First you need to create an init function that will be called by Fred to initialise your plugin.

The init function takes 3 arguments: 
 
- `fred` - reference to Fred's main class
- `ToolbarPlugin` - ToolbarPlugin class that your plugin has to extend
- `pluginTools` - set of tools you can use in your plugin (list of available tools is [here](https://github.com/modxcms/fred/blob/master/_build/assets/js/Utils.js#L378))

The init function has to return class (that extends ToolbarPlugin).

### Example
```js
var TestToolbarPluginInit = function(fred, ToolbarPlugin, pluginTools) {
    class TestToolbarPlugin extends ToolbarPlugin {
        render() {
            return pluginTools.ui.els.button('', 'Test Plugin', ['fred--element-settings'], () => {
                console.log('Test Plugin icon pressed from the toolbar');
            });
        };
    }
    
    return TestToolbarPlugin;
};
```

## Register your plugin
When you have the init function returning your plugin's class, you need to let Fred know about your plugin.

You'll need to create a MODX Plugin using the [FredBeforeRender](/developer/modx_events#fredbeforerender) event.

Include the JS file containing the init function using [includes](/developer/modx_events#includes) and registering the plugin using [beforeRender](/developer/modx_events#beforerender).


To register the toolbar plugin, you'll need to call `registerToolbarPlugin` function from Fred. It takes 2 arguments:

- name - unique name for your plugin (Fred can't register 2 plugins with the same name)
- init function - the `TestToolbarPluginInit` function we created in [Init function](#init-function) step

### Example
```php
$includes = '
    <script type="text/javascript" src="/path/to/plugin/file.js"></script>
';

$beforeRender = '
    this.registerToolbarPlugin("TestToolbarPlugin", TestToolbarPluginInit);
';

$modx->event->_output = [
    'includes' => $includes, 
    'beforeRender' => $beforeRender
];
```

## The plugin class
We created a sample Class in the [Init function](#init-function) step, so now it's time to make it do something more than just a console.log.

[Here](https://github.com/modxcms/fred/tree/master/_build/assets/js/Components/Sidebar/Elements/Toolbar) you can check current toolbar plugins and get a sense of how to create your own.

### Custom data
Your plugin can also save/load a custom data when the page is saved. Be aware that these custom data gets saved only if the user saves the whole page.

#### Element Data
This data are attached to the Fred element where to toolbar action occurred. To save data, you can call `this.el.setPluginValue('Namespace', 'VariableName', 'Data')`. As you can see, the function takes 3 arguments:

- namespace - I'd recommend using plugin's name or something unique, so your data won't get overwritten by some other plugin
- name - name of the variable where you want to save the data
- value - the actual data to store

And to load your data you can call `this.el.getPluginValue('Namespace', 'VariableName')` which takes 2 arguments:

- namespace - Same namespace as you used when calling `setPluginValue`
- name - same name as you used when calling `setPluginValue`

#### Global Data
Or this data can be saved globally (not attached to an element). To save them this way, call `pluginTools.fredConfig.setPluginsData('Namespace', 'VariableName', 'Data')`. This function takes same arguments as `this.el.setPluginValue`.

And to load the data you call `pluginTools.fredConfig.getPluginsData('Namespace', 'VariableName')`. This function takes same arguments as `this.el.getPluginValue`.