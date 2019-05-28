# Sidebar Plugins

Fred supports adding functionality to the Sidebar by adding Sidebar plugins.

Plugins are distributed as MODX Transport Packages, which can be submitted to the [MODX Extras repository](https://modx.com/extras) or uploaded manually from the Installer inside the Manager. You can learn more about [how to build Transport Packages](https://docs.modx.com/revolution/2.x/case-studies-and-tutorials/developing-an-extra-in-modx-revolution) in the MODX Documentation, or use a tool like [Git Package Management](https://theboxer.github.io/Git-Package-Management/) to help create Transport Packages.

## Init function

To initialise your plugin start by creating an `init` function that will be called by Fred. An `init` function takes three arguments:

- `fred` – a reference to the main Fred class
- `SidebarPlugin` – the SidebarPlugin class that your plugin has to extend
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

The `init` function must return a class that extends the SidebarPlugin.

### Example

```javascript
var TestSidebarPluginInit = function(fred, SidebarPlugin, pluginTools) {
    class TestSidebarPlugin extends SidebarPlugin {
        static title = 'TestPlugin';
        static icon = 'fred--sidebar_more';
        static expandable = true;

        init() {
            this.content = this.render();
        }

        click() {
            return this.content;
        }

        render () {
            const moreList = pluginTools.ui.els.dl();

            const helpLink = pluginTools.ui.els.a('fred.fe.more.help', 'fred.fe.more.help', 'https://modxcms.github.io/fred/');
            helpLink.target = '_blank';

            moreList.appendChild(pluginTools.ui.els.dt(helpLink));

            return moreList;
        }
    }

    return TestSidebarPlugin;
};
```

This will create an additional sidebar icon before the `More` item in the sidebar with the same icon as the More item, three dots.

## Icons & Menus

Sidebar icons are `dt` HTML elements with specific classes. For example, the Settings button from the Sidebar is marked up as follows:

```html
<dt class="fred--sidebar_page_settings" tabindex="0" role="tab">Settings</dt>
```

The CSS class `fred--sidebar_page_settings` determines the appearance of the button. To style a new toolbar icon, you need to target the psuedo element `::before` in your plugin’s CSS with inline SVG code for a background image:  

```css
.fred .fred--sidebar_page_settings:before {
    background: url(data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 …35.888-80 80 35.888 80 80 80 80-35.888 80-80z' fill='%23fff'/%3E%3C/svg%3E) center center no-repeat;
}
```

Any custom CSS file for your plugin including a custom icon like the above, and other styles needed for the plugin, can be included the same way as the JavaScript file in [Register your Plugin](#register-your-plugin) step, below.

Fred’s default icons are the SVG versions of [Font Awesome 5 icons](https://fontawesome.com/icons?d=gallery). You can download the SVG of any icon from its detailed page.

### Menus

If your plugin needs a menu similar to the Elements or Settings, they are defined inside the `dd` HTML elements. For example, the Settings menu begins as follows:

```html
<dd>
    <h3 class="">Settings</h3>
    <form class="fred--page_settings_form">
        <fieldset class="">
            <label class="">Page Title<input class="" type="text"></label>
            …
```

### Sidebar Plugin Order

The buttons registered to the sidebar are always added before the `More` button. If there are multiple Sidebar Plugins registered, they will render in the order of the MODX Plugin’s rank in the MODX Manager.

## Register your Plugin

When you have the `init` function returning your plugin's class, you need to register it for Fred by creating a MODX Plugin on the `[FredBeforeRender](/developer/modx_events#fredbeforerender)` event.

Include the JS file containing the init function using [includes](/developer/modx_events#includes) and registering the Plugin using [`beforeRender`](/developer/modx_events#beforerender).

To register the toolbar Plugin, you call the `registerSidebarPlugin` function from Fred with two arguments:

- `name` - a unique name for your plugin. Fred cannot register multiple Plugins with the same name.
- `init function` - the `TestSidebarPluginInit` function we created in [`Init function`](#init-function) step, above

### Example

```php
$includes = '
    <script type="text/javascript" src="/path/to/plugin/file.js"></script>
    <link rel="stylesheet" href="/path/to/stylsheet/style.css" />
';

$beforeRender = '
    this.registerSidebarPlugin("TestSidebarPlugin", TestSidebarPluginInit);
';

$modx->event->_output = [
    'includes' => $includes,
    'beforeRender' => $beforeRender
];
```

## The Plugin class

The sample Class in the [`Init function`](#init-function) step above can do much more than just show a link to Help page. In fact, much of Fred's functionality is already coded as Plugins. To review the current Sidebar Plugins for a sense of how to create your own, [review the source code on Github](https://github.com/modxcms/fred/tree/master/_build/assets/js/Components/Sidebar).

### Custom Data

Your Plugin can save and load custom data when the page is saved. Be aware, though, that custom data is only saved when a user saves the entire page.

To save your plugin's data call `pluginTools.fredConfig.setPluginsData('Namespace', 'VariableName', 'Data')`. This function takes three arguments:

- `namespace` - for most cases, use the Plugin's name or something unique to prevent data from being overwritten by another Plugin
- `name` - the name of the variable where you want to save the data
- `value` - the actual data to store

To load data, call `pluginTools.fredConfig.getPluginsData('Namespace', 'VariableName')` which takes two arguments:

- `namespace` - the same namespace used when calling `setPluginsData`
- `name` - the same name used when calling `setPluginsData`
