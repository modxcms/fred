# Preparing MODX Templates for use with Fred

Fred only loads on Pages which use MODX Templates assigned to a Fred Theme (`Extras` > `Fred` > `Themed Templates`). Any Resource using a template listed in that table will block access to the Content area in the Manager and load Fred on the front-end when logged in for editing.

## Dropzones

Most templates will have a *content* Dropzone. Fred also supports multiple Dropzones for things like sidebars, headers, footers, or any other purpose you need. In your Fred Templates, you need to define where Dropzones will be by using `data-fred-…` attributes with HTML.

### Simple Fred Template Example with One Dropzone

```
<html>
<head>
    <title>[[*pagetitle]]</title>

</head>
<body >
    <div data-fred-dropzone="content" data-fred-min-height="500px">
        [[*content]]
    </div>
</body>
</html>
```

The default minimum height for a dropzone is only 5 pixels, which may be a bit small to target. If you wish to have a larger “empty” default state, add a `data-fred-min-height="250px"` setting with your desired minimum height. A larger minimum height on a dropzone can make it easier to target for dropping Elements when empty. The size of your min-height might also need to change if you have competing or overlapping Elements, such as a fixed top navigation bar.

The dropzone’s `data-fred-dropzone="content"` attribute is required and tells it where to save the rendered Fred content. It also needs to contain a reference to the `[[*content]]` tag inside of it. When Fred loads, it clears out the content rendered in the dropzone, and loads it with Element data. However, when Fred is not loaded, it just renders whatever tags you have in that area.

### Multiple Dropzones

Sometimes you may want to have a more complex layout with multiple Dropzones, like for a main content area and a sidebar. Fred installs a new Template Variable type for this purpose: `Fred Dropzone`. To create another dropzone do the following:

1. From the MODX Manager, navigate to the `Elements` sidebar tree > `Template Variables` drop-down list > `+` circle icon to create a new TV
2. Give the TV a name, such as “sidebar” and assign it to a Fred category
3. From the `Input Options` tab choose "Fred Dropzone" from the Input Type select list
4. If you want to see the rendered content from the Manager, change the value of the last “Hide Field from Manager:” option to “No”.

![Fred Dropzone TV Screenshot]()

#### Example Template with `sidebar` Dropzone

```
<html>
<head>
    <title>[[*pagetitle]]</title>

</head>
<body >
    <section id="wrapper">
        <div id="main" data-fred-dropzone="content" data-fred-min-height="500px">
            [[*content]]
        </div>
        <aside id="sidebar" data-fred-dropzone="sidebar" data-fred-min-height="250px">
            [[*sidebar]]
        </aside>
    </section>
</body>
</html>
```
