# `data-fred-…` Attributes

The following are the currently available attributes for Fred Elements.

## data-fred-dropzone

This defines a Drop Zone where Fred Elements can be dragged from the sidebar and dropped into to create pages. This attribute cannot be empty and must be unique within an Element. While you can create an unlimited number of Dropzones, more than a few might become cumbersome and fragile. Good use cases for multiple Dropzones includes alternate layouts like full width, split pages, pages with sidebars, etc.

### Example

```html
<div data-fred-dropzone="left" class="left-content"></div>
<div data-fred-dropzone="right" class="right-content"></div>
```

## data-fred-name

This is a unique name for each Element, the contents of which should be editable. Elements with this attribute will be saved and processed by Fred. By default, Elements with a `data-fred-name` attribute are automatically editable by end users, unless a `contentedtiable="false"` is explicitly declared (see next).

The value of this attribute has to be unique in each Element, but you can have multiple instances of an Element on the page and different Elements can share common `data-fred-name` attributes without problem.

**Note:** Because Fred wraps all Elements in a `<div>`, you cannot currently use Fred to build elements that would break HTML validation such as table rows, list items, definition lists, etc. This will be solved in a future release.

### Examples

```html
<!-- Simple editable paragraph -->
<p data-fred-name="description">Default value</p>

<!-- Editable image -->
<img src="http://via.placeholder.com/450x150" data-fred-name="header-image">
```

## data-fred-editable

When set to `false` the content inside of the HTML Element will not be editable for end users, including any nested Dropzone content. This attribute only works when used with `data-fred-name`.

### Example

```html
<p data-fred-name="description" data-fred-editable="false" data-fred-target="description">The value from the description field goes here</p>
```

## data-fred-attrs

Defines other HTML attributes (comma separated) to save with the content of the HTML element where supported by the editor, such as alt and title attributes with images.  

### Example

```html
<img src="http://via.placeholder.com/450x150" alt="Default Alt" data-fred-name="header-image" data-fred-attrs="alt,title">
```

## data-fred-render

This allows developers to create user-friendly, self-documenting Elements that inform users what they need to do in order to create content. When set to `false` these Element only appear when Fred is active. 

### Example

```html
<p data-fred-render="false" class="editor-instructions">Add a *Link Location* setting for this Element to make a call to action button appear. (This block is only visible when using Fred.)</p>
```

## data-fred-target

This defines the Resource field or TV in which to store content. Content of the Element will be stored in regular Content field and additionally in the specified target. This attribute can’t be used on a dropzone.

**Available targets:**

- pagetitle
- longtitle
- description
- introtext
- menutitle
- alias
- Template Variables (TVs)

**Note:** using TV targets only stores in text or textarea inputs only, as the actual data is stored as a JSON object. As such, some TV input types defined in the MODX Manager such as select inputs, Google Map Markers, etc., will not work. All TV names _must_ be prefixed with `tv_` in order to save to a TV.

### Examples

```html
<h1 data-fred-name="title" data-fred-target="pagetitle">Default Page Title</h1>
```

```html
<h1 data-fred-name="my-tv" data-fred-target="tv_job-title">Targets the "job-title" TV field</h1>
```

## data-fred-rte

If set to `true` the Rich Text Editor will be loaded for editing the content inside this Element.

### Example

```html
<div data-fred-name="rte-content" data-fred-rte="true">Default Content</div>
```

## data-fred-rte-config

This is useful when you need a limited or expanded set of rich text editor controls than provided by the default configuration, allowing you to specify an overriding [alternate RTE config](../rte_configs/index.md) than the default RTE config.

### Example

```html
<div data-fred-name="rte-content" data-fred-rte="true" data-fred-rte-config="bold-and-italics-only">The RTE for this content will only show the bold and italics buttons</div>
```

## data-fred-media-source

This option defines a specific Media Source for Elements, using the names of one or more Media Sources, separated by commas for all file types.

### Example

```html
<a href="assets/pdfs/brochure.pdf" data-fred-name="brochure" data-fred-media-source="Assets">download our brochure</a>
```

## data-fred-image-media-source

Identical to `data-fred-media-source` but only for images.

### Example

```html
<img src="http://via.placeholder.com/450x150" data-fred-name="header-image" data-fred-image-media-source="Blogs,Images">
```

## data-fred-block-class

Allows you to specify an additional class which is added to the wrapping `div.fred--block` added around Elements when Fred is loaded. This can be useful when JavaScript libraries or CSS styling techniques require specific wrapper classes. When Fred is not loaded, the attribute will be added to the classes of the element itself.

### Example

Element Markup:
```html
<div class="image" data-fred-block-class="special-wrapper"></div>
```
When Fred is loaded, the markup around it will look as follows:

```html
<div class="fred--block special-wrapper">
    <div class="fred--toolbar">…</div>
    <div class="fred--block_content" data-fred-element-id="5ce33419-44d6-4e30-90db-8c9a62d04763" data-fred-element-title="Image">
        <div class="image"></div>
    </div>
</div>
```
When Fred is _not_ loaded, the processed markup for the element will look as follows:

```html
<div class="image special-wrapper"></div>
```

## data-fred-class

The value of this attribute will be added to class for this element only when Fred is _not_ loaded. 

## Example

Element Markup: 
```html
<div class="row" data-fred-class="visible-grid foo"></div>
```

When Fred is loaded, the class is omitted:

```html
<div class="row"> … </div>
```

When Fred is _not_ loaded, the class is added:

```html
<div class="row visible-grid foo"> … </div>
```

## data-fred-bind

This allows you to bind the value of another part of the page to another location within one Element.

### Example

Element Markup:

```html
<div data-fred-name="name" data-fred-render="false">John Doe</div>
<div class="modal">
    <div class="modal-header" data-fred-bind="name"></div>
    <div class="modal-content">Hello there</div>
</div>
```

Rendered HTML:

```html
<div class="modal">
    <div class="modal-header">John Doe</div>
    <div class="modal-content">Hello there</div>
</div>
```

## data-fred-on-drop

The name of a globally-accessible JavaScript function to be called when the Element is dropped into any Dropzone. The function will receive fredEl as its first attribute.

You can use this to trigger a JavaScript function, for example, calling a slider initialise script that you normally have `document.ready` function call. Without using this attribute, you would need to save and reload the page to initialise the newly dropped slider item.

### Example

```html
<div class="clock" data-fred-on-drop="initClock">
```

## data-fred-on-setting-change

The name of a globally-accessible JavaScript function to be called when an Element setting changes. The function will receive fredEl as its first attribute.

### Example

```html
<div class="clock" data-fred-on-setting-change="reInitClock"></div>
```

## data-fred-link-type
## data-fred-link-page

Used by the TinyMCE RTE with a `data-fred-link-page` attribute to create links in the MODX format of `[[~2]]`. These links are processed into the href target before generating content. 

### Example

```html
<a href="fred.html" data-fred-link-type="page" data-fred-link-page="2">Fred</a>
```

## data-fred-min-height

Applicable for dropzones. When set, the value used in this attribute will be set in the dropzone's style min-height. 

### Example

```html
<div data-fred-dropzone="content" data-fred-min-height="50px"></div>
```

## data-fred-min-width

Applicable for dropzones. When set, the value used in this attribute will be set in the dropzone's style min-width. 

### Example

```html
<div data-fred-dropzone="content" data-fred-min-width="50px"></div>
```
