# `data-fred-…` Attributes

The following are the currently available attributes for Fred Elements.

## data-fred-editable

When set to `true` the content of the HTML Element will be editable for end users, including any Elements nested within (for nested Dropzones). This attribute has to be used with `data-fred-name` to save the value. This attribute is set to `true` by default.

### Example

```html
<p data-fred-name="description" data-fred-editable="true">Default value</p>
```

## data-fred-name

A unique (to this Element) name of the editable HTML Element. Only Elements with this attribute will be saved. By default, Elements with a `data-fred-name` attribute will automatically behave as if `contentedtiable="true"` was explicitly declared.

The value of this attribute has to be unique across in a single Element, but you can have multiple instances of an Element on the page. In addition, different Elements can share names.

### Examples

```html
<!-- Simple editable paragraph -->
<p data-fred-name="description">Default value</p>

<!-- Editable image -->
<img src="http://via.placeholder.com/450x150" data-fred-name="header-image">
```

## data-fred-attrs

Defines other HTML attributes (comma separated) to save with the content of the HTML element where supported by the editor. E.g. Add alt and title attributes to the ImageEditor.  

### Example

```html
<img src="http://via.placeholder.com/450x150" alt="Default Alt" data-fred-name="header-image" data-fred-attrs="alt,title">
```

## data-fred-render

If set to `false` HTML Element won’t appear when Fred is not loaded. This allows developers to create user-friendly, self-documenting Elements that inform users what they need to do in order to create content.

### Example

```html
<p data-fred-render="false">Add a *Link Location* setting for this Element to make the button appear. (This will be visible only when Fred is used to create content.)</p>
```

## data-fred-target

Defines Resource field to store content. Content of the HTML Element will be stored in regular Content field and additionally in the specified target. This attribute can’t be used on a dropzone.

**Available targets:**

- pagetitle
- longtitle
- description
- introtext
- menutitle
- alias
- template variables (text- or textarea-only)

### Example

```html
<h1 data-fred-name="title" data-fred-target="pagetitle">Default Page Title</h1>
```

## data-fred-rte

If set to `true` the Rich Text Editor will be loaded for the editable HTML Element.

### Example

```html
<div data-fred-name="rte-content" data-fred-rte="true">Default Content</div>
```

## data-fred-rte-config

Specify RTE config that should be used for the Element.

### Example

```html
<div data-fred-name="rte-content" data-fred-rte="true" data-fred-rte-config="simple">Default Content</div>
```

## data-fred-dropzone

Defines a new Drop Zone for Fred Elements. This attribute cannot be empty and has to be unique across a single Element. You can create an unlimited number of Dropzones, though more than a few might get quite cumbersome. This is useful for creating alternate layouts like full width, split pages, sidebar pages, etc.

### Example

```html
<div data-fred-dropzone="left" class="left-content"></div>
<div data-fred-dropzone="right" class="right-content"></div>
```

## data-fred-link-type

Sets a type for a link, used for processing before generating content. Available values: `page`
Used together with other `data-fred-link-` attributes.

### Example

```html
<a href="fred.html" data-fred-link-type="page" data-fred-link-page="2">Fred</a>
```

## data-fred-link-page

Defines ID of MODX Resource. Value of this attribute will be used as a link’s href (in MODX format `[[~ID]]`) when content is generated.

### Example

```html
<a href="fred.html" data-fred-link-type="page" data-fred-link-page="2">Fred</a>
```

## data-fred-media-source

This option override globals from Element Settings.

Defines Media Source to be used for the Element. Name of the media source is expected and can accommodate multiple Names separated by comma `,`.

### Example

```html
<img src="http://via.placeholder.com/450x150" data-fred-name="header-image" data-fred-media-source="Assets,Images">
```

## data-fred-image-media-source

This option override globals from Element Settings and `data-fred-media-source` (but only for images).

Defines Media Source to be used for the Element. Name of the media source is expected and can accommodate multiple Names separated by comma `,`.

### Example

```html
<img src="http://via.placeholder.com/450x150" data-fred-name="header-image" data-fred-image-media-source="Assets,Images">
```

## data-fred-block-class

When Fred is loaded, value of this attribute will be appended to class of `div.fred--block` (which is wrapping the whole Element). When Fred is not loaded, attribute will be added to class of itself.

### Example

```html
<div class="image" data-fred-block-class="wrapper"></div>
```

## data-fred-class

When Fred is loaded, value of this attribute will be added to the own class.

## Example

```html
<div class="row" data-fred-class="visible-grid"></div>
```

## data-fred-bind

Value of the Element will copy from other Element.

### Example

```html
<div data-fred-name="name">John Doe</div>
<div class="modal">
    <div class="modal-header" data-fred-bind="name"></div>
    <div class="modal-content">Hello there</div>
</div>
```

## data-fred-on-drop

The name of the globally accessible function that should be called when this Element is dropped on any Dropzone. The function will receive fredEl as a first attribute.

You can use this to trigger a Javascript function, for example, calling a slider initialise script that you normally have `document.ready` function call. Without using this attribute, you would need to save and reload the page to initialise the newly dropped slider item.

### Example

```html
<div class="clock" data-fred-on-drop="initClock">
```

## data-fred-on-setting-change

Name of the globally accessible function that should be called when Element setting changes. The function will receive fredEl as first attribute.

### Example

```html
<div class="clock" data-fred-on-setting-change="reInitClock"></div>
```
