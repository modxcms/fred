# Toolbar Plugins

Fred supports adding functionality to individual Elements by registering new buttons in the toolbar above each Element.

![Element Toolbar](/media/toolbar.png)

Since most Fred plugins should deal with the front-end editing experience, they will typically reside in the `assets/components/` directory, with a layout similar to the following:

```
plugin-name/
  web/
    main.js
    style.css
    img/   
```

## Init function
To initialise your plugin start by creating an `init` function that will be called by Fred. An `init` function takes three arguments: 
 
- `fred` – a reference to the main Fred class
- `ToolbarPlugin` – the ToolbarPlugin class that your plugin has to extend
- `pluginTools` – a set of tools you can use in your plugin (see below).

### `pluginTools`

Plugin Tools allow you to create and manipulate content using programming methods. The various tool types available to Fred Toolbar Plugins include:

**TODO**: explain what each of the following tools can do or is used for…

- `valueParser` – accepts a value and removes references to the theme directory
- `ui` – a reference to the UI class for building elements and inputs
- `emitter` – a tool used to emit functions that can be picked up by other classes
- `Modal` – the Fred modal object that controls the output and visibility of modals
- `fetch` – use for Ajax calls
- `fredConfig` – the configuration object containing fred settings
- `utilitySidebar` – the Fred sidebar object that controls the output and visibility of the sidebar


The `init` function must return a class that extends the ToolbarPlugin.

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

This will create an additional toolbar icon at the end of the  toolbar making it look as follows:

**TODO**: actual screenshot with custom plugin

![Element Toolbar with Plugin](/media/toolbar.png)

## Icons
Toolbar icons are button elements with specific classes. For example, the delete button from the toolbar is marked up as follows:

```html
<button class="fred--trash" role="button" title="Delete"></button>
```

In the example above, the CSS class `fred--trash` determines the appearance of the button. To style a new toolbar icon, you need to target the psuedo element `::before` in your plugin’s CSS with inline SVG code for a background image, and a background color. You can optionally have a differnt background color when hovered:  

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

Fred’s default icons are the SVG versions of the [Font Awesome 5 icons](https://fontawesome.com/icons?d=gallery). You can download the SVG of each icon from its detailed page.

## Limiting Plugins to specific Elements

**TODO:** describe how to limit Plugins to specific Elements, and where/order they're rendered

By default, all Toolbar Plugins will register for every Element. To specify the order and omit some plugins, you can specify them in the Option Sets for specific Elements. To do this, the Element's [Option Set](/themer/options/settings.md) must call the name of the Plugin in its settings. For example:

```json
{
  "plugins": ["Gallery Picker","Map Marker"],  
  "settings": [
    {
        …
    }
  ]
}
```

To prevent Plugins from registering on an Element completely, specify a value of `false` for the `plugins` option:

```json
{
  "plugins": false,  
  "settings": [
    {
        …
    }
  ]
}
```

### Default Toolbar Plugin Order

The buttons registered to the toolbars are always added after the built-in default buttons. If there are multiple Toolbar Plugins registered, they will render in the order of the MODX Plugin’s rank in the MODX Manager.


## Register your Plugin
When you have the `init` function returning your plugin's class, you need to register it for Fred by creating a MODX Plugin on the `[FredBeforeRender](/developer/modx_events#fredbeforerender)` event.

Include the JS file containing the init function using [includes](/developer/modx_events#includes) and registering the Plugin using [`beforeRender`](/developer/modx_events#beforerender).


To register the toolbar Plugin, you call the `registerToolbarPlugin` function from Fred. It takes 2 arguments:

- `name` - a unique name for your plugin. Fred cannot register multiple Plugins with the same name.
- `init function` - the `TestToolbarPluginInit` function we created in [`Init function`](#init-function) step, above

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

## The Plugin class
The sample Class in the [`Init function`](#init-function) step above can do much more than just logging to the console via `console.log`. In fact, much of Fred's functionality is already coded as Plugins. To review the current Toolbar Plugins for a sense of how to create your own, [review the source code on Github](https://github.com/modxcms/fred/tree/master/_build/assets/js/Components/Sidebar/Elements/Toolbar).

### Custom data
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