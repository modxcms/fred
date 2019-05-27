# Toolbar Plugins

Fred supports adding functionality to individual Elements by registering new buttons in the toolbar above each Element.

![Element Toolbar](/media/toolbar.png)

Plugins are distributed as MODX Transport Packages, which can be submitted to the [MODX Extras repository](https://modx.com/extras) or uploaded manually from the Installer inside the Manager. You can learn more about [how to build Transport Packages](https://docs.modx.com/revolution/2.x/case-studies-and-tutorials/developing-an-extra-in-modx-revolution) in the MODX Documentation, or use a tool like [Git Package Management](https://theboxer.github.io/Git-Package-Management/) to help create Transport Packages.

## Init function
To initialise your plugin start by creating an `init` function that will be called by Fred. An `init` function takes three arguments: 
 
- `fred` – a reference to the main Fred class
- `ToolbarPlugin` – the ToolbarPlugin class that your plugin has to extend
- `pluginTools` – a set of tools you can use in your Plugin to create content and save data. [View the source code on Github](https://github.com/modxcms/fred/blob/master/_build/assets/js/Utils.js#L374-L387) for a list of available classes, instances and functions which can be used, including:
    - `valueParser` – parses Template Variables (such as `{{theme_dir}}`) and replaces them with the correct value based on the given parameters
    - `ui` – a set of UI elements and inputs to use, including
    - `emitter` – emits or listen for events
    - `Modal` – a class to create a modal window
    - `fetch` – use to make XHR requests
    - `fredConfig` – an instance of `fredConfig`
    - `utilitySidebar` – creates a sidebar, like the one used for Element settings
    - `actions` - predefined Fred XHR requests
    - `Mousetrap` - library for keyboard shortcuts

The `init` function must return a class that extends the ToolbarPlugin.

### Example
```js
var TestToolbarPluginInit = function(fred, ToolbarPlugin, pluginTools) {
    class TestToolbarPlugin extends ToolbarPlugin {
        static title = 'Test Plugin';
        static icon = 'fred--element-settings';
        
        onClick() {
            console.log('Test Plugin icon pressed from the toolbar');
        };
    }
    
    return TestToolbarPlugin;
};
```

This will create an additional toolbar icon at the end of the toolbar with the same icon as the Settings icon, a gear.

## Icons
Toolbar icons are button elements with specific classes. For example, the delete button from the toolbar is marked up as follows:

```html
<button class="fred--trash" role="button" title="Delete"></button>
```

The CSS class `fred--trash` determines the appearance of the button. To style a new toolbar icon, you need to target the psuedo element `::before` in your plugin’s CSS with inline SVG code for a background image, and a background color. You can optionally have a differnt background color when hovered:  

```css
.fred--my_plugin_button::before {
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' fill='%23fff'%3E%3Cpath d='M512 144v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48h88l12.3-32.9c7-18.7 24.9-31.1 44.9-31.1h125.5c20 0 37.9 12.4 44.9 31.1L376 96h88c26.5 0 48 21.5 48 48zM376 288c0-66.2-53.8-120-120-120s-120 53.8-120 120 53.8 120 120 120 120-53.8 120-120zm-32 0c0 48.5-39.5 88-88 88s-88-39.5-88-88 39.5-88 88-88 88 39.5 88 88z'/%3E%3C/svg%3E");
    background-color: #e46363;
}
.fred--my_plugin_button::before:hover {
    background-color: #061323;
}
```
Any custom CSS file for your plugin including a custom icon like the above, and other styles needed for the plugin, can be included the same way as the JavaScript file in [Register your Plugin](#register-your-plugin) step, below.

Fred’s default icons are the SVG versions of [Font Awesome 5 icons](https://fontawesome.com/icons?d=gallery). You can download the SVG of any icon from its detailed page.

### Toolbar Plugin Order

The buttons registered to the toolbars are always added after the built-in default buttons. If there are multiple Toolbar Plugins registered, they will render in the order of the MODX Plugin’s rank in the MODX Manager.

## Limiting Plugins for Elements

By default, all Toolbar Plugins will register for every Element. To specify the order and/or omit some plugins, modify an Element’s [Option Set](/themer/options/settings.md) setting to either include or exclude specific Fred Plugins with a  `plugins-include` or `plugins-exclude` attribute. 

**Note:** The plugins are unique names of the class created for the plugins. As a general rule, this should match the plugin name used for the MODX Package Provider. 

If a `plugins-include` attribute is included, it will ignore any `plugins-exclude` lines. To include only specific Plugins for an Element, use a `plugins-include` Options setting:

```json
{
  "toolbarPluginsInclude": ["gallery","mapmarker"],  
  "settings": [
    {
        …
    }
  ]
}
```

To exclude one or more specific Plugins on an Element, use a `plugins-exclude` option:

```json
{
  "toolbarPluginsExclude": ["fredfontawesome5iconeditor"],  
  "settings": [
    {
        …
    }
  ]
}
```

To prevent all Plugins from registering on an Element completely, specify an empty array for a `plugins-include` option:

```json
{
  "plugins-include": [],  
  "settings": [
    {
        …
    }
  ]
}
```

**Note:** The plugins are unique names of the class created for the plugins. As a general rule, this should match the plugin name used for the MODX Package Provider. 

If a `pluginsInclude` attribute is included, it will ignore any `pluginsExclude` lines. To include only specific Plugins for an Element, use a `pluginsInclude` Options setting:

```json
{
  "pluginsInclude": ["gallery","mapmarker"],  
  "settings": [
    {
        …
    }
  ]
}
```

To exclude one or more specific Plugins on an Element, use a `pluginsExclude` option:

```json
{
  "pluginsExclude": ["fredfontawesome5iconeditor"],  
  "settings": [
    {
        …
    }
  ]
}
```

To prevent all Plugins from registering on an Element completely, specify an empty array for a `pluginsInclude` option:

```json
{
  "pluginsInclude": [],  
  "settings": [
    {
        …
    }
  ]
}
```

## Register your Plugin
When you have the `init` function returning your plugin's class, you need to register it for Fred by creating a MODX Plugin on the `[FredBeforeRender](/developer/modx_events#fredbeforerender)` event.

Include the JS file containing the init function using [includes](/developer/modx_events#includes) and registering the Plugin using [`beforeRender`](/developer/modx_events#beforerender).


To register the toolbar Plugin, you call the `registerToolbarPlugin` function from Fred with two arguments:

- `name` - a unique name for your plugin. Fred cannot register multiple Plugins with the same name.
- `init function` - the `TestToolbarPluginInit` function we created in [`Init function`](#init-function) step, above

### Example
```php
$includes = '
    <script type="text/javascript" src="/path/to/plugin/file.js"></script>
    <link rel="stylesheet" href="/path/to/stylsheet/style.css" />
';

$beforeRender = '
    this.registerToolbarPlugin("TestToolbarPlugin", TestToolbarPluginInit);
';

$modx->event->_output = [
    'includes' => $includes, 
    'beforeRender' => $beforeRender
];
```

## The Plugin class
The sample Class in the [`Init function`](#init-function) step above can do much more than just logging to the console via `console.log`. In fact, much of Fred's functionality is already coded as Plugins. To review the current Toolbar Plugins for a sense of how to create your own, [review the source code on Github](https://github.com/modxcms/fred/tree/master/_build/assets/js/Components/Sidebar/Elements/Toolbar).

### Custom Data
Your Plugin can save and load custom data when the page is saved. Be aware, though, that custom data is only saved when a user saves the entire page.

#### Element Data
Toolbar Plugins typically should affect the Elements on which they act. This data are attached to the Fred element where to toolbar action occurred. To save data, use `this.el.setPluginValue('Namespace', 'VariableName', 'Data')`. This function takes three arguments:

- `namespace` - for most cases, use the Plugin's name or something unique to prevent data from being overwritten by another Plugin
- `name` - the name of the variable where you want to save the data
- `value` - the actual data to store

To load data, use `this.el.getPluginValue('Namespace', 'VariableName')` which takes two arguments:

- `namespace` - the same namespace used when calling `setPluginValue`
- `name` - the same name used when calling `setPluginValue`

#### Global Data
Data assoiated with a Plugin can optionally be saved globally, not attached to a specific Element. To save data this way, call `pluginTools.fredConfig.setPluginsData('Namespace', 'VariableName', 'Data')`. This function takes same arguments as `this.el.setPluginValue`.

To load global data, call `pluginTools.fredConfig.getPluginsData('Namespace', 'VariableName')`. This function takes same arguments as `this.el.getPluginValue`.
