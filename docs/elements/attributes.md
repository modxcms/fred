Currently available attributes for Fred elements.

### contenteditable
If set to `true` the content of the HTML element will be editable for the user, including all children.
This attribute has to be used with `data-fred-name` to save the value.

#### Example
```html
<p contenteditable="true" data-fred-name="description">Default value</p>
```

### data-fred-name
Name for the editable HTML element. Only elements with this attribute will be saved.
Value of this attribute has to be unique across a single Element, but you can have multiple instances of an Element on pages.

#### Example
```html
<!-- Simple editable paragraph -->
<p contenteditable="true" data-fred-name="description">Default value</p>

<!-- Editable image -->
<img src="http://via.placeholder.com/450x150" data-fred-name="header-image">
```

### data-fred-attrs
Defines other HTML attributes (comma separated) to save with the content of the HTML element. 

#### Example
```html
<img src="http://via.placeholder.com/450x150" alt="Default Alt" data-fred-name="header-image" data-fred-attrs="alt">
```

### data-fred-render
If set to `false` HTML element won't appear when Fred is not loaded. This allows developers to create user-friendly, self-documenting Elements that inform users what they need to do in order to create content.

#### Example
```html
<p data-fred-render="false">Add a *Link Location* setting for this Element to make the button appear. (This will be visible only when Fred is used to create content.)</p>
```

### data-fred-target
Defines Resource field to store content. Content of the HTML element will be stored in regular Content field and additionally in the specified target. This attribute can't be used on a dropzone. 

**Available targets:**

 - pagetitle
 - longtitle
 - description
 - introtext
 - menutitle
 - alias

#### Example
```html
<h1 data-fred-name="title" data-fred-target="pagetitle" contenteditable="true">Default Page Title</h1>
```

### data-fred-rte
If set to `true` the Rich Text Editor will be loaded for the editable HTML element.

#### Example
```html
<div data-fred-name="rte-content" contenteditable="true" data-fred-rte="true">Default Content</div>
```

### data-fred-rte-config
Specify RTE config that should be used for the element.

#### Example
```html
<div data-fred-name="rte-content" contenteditable="true" data-fred-rte="true" data-fred-rte-config="simple">Default Content</div>
```

### data-fred-dropzone
Defines a new Drop Zone for Fred Elements. This attribute cannot be empty and has to be unique across a single Element. You can create an unlimited number of Dropzones, though more than a few might get quite cumbersome. This is useful for creating alternate layouts like full width, split pages, sidebar pages, etc.

#### Example
```html
<div data-fred-dropzone="left" class="left-content"></div>
<div data-fred-dropzone="right" class="right-content"></div>
```

### data-fred-link-type
Sets a type for a link, used for processing before generating content. Available values: `page`
Used together with other `data-fred-link-` attributes.

#### Example
```html
<a href="fred.html" data-fred-link-type="page" data-fred-link-page="2">Fred</a>
```

### data-fred-link-page
Defines ID of MODX Resource. Value of this attribute will be used as a link's href (in MODX format `[[~ID]]`) when content is generated.

#### Example
```html
<a href="fred.html" data-fred-link-type="page" data-fred-link-page="2">Fred</a>
```

### data-fred-media-source
This option override globals from Element Settings.

Defines Media Source to be used for the element. ID of the media source is expected and can accommodate multiple IDs separated by comma `,`.

#### Example
```html
<img src="http://via.placeholder.com/450x150" data-fred-name="header-image" data-fred-media-source="1,2">
```

### data-fred-image-media-source
This option override globals from Element Settings and `data-fred-media-source` (but only for images).

Defines Media Source to be used for the element. ID of the media source is expected and can accommodate multiple IDs separated by comma `,`.

#### Example
```html
<img src="http://via.placeholder.com/450x150" data-fred-name="header-image" data-fred-image-media-source="1,2">
```

### data-fred-block-class
When Fred is loaded, value of this attribute will be appended to class of `div.fred--block` (which is wrapping the whole element). When Fred is not loaded, attribute will be added to class of itself. 

#### Example
```html
<div class="image" data-fred-block-class="wrapper"></div>
```

### data-fred-class
When Fred is loaded, value of this attribute will be added to the own class.

### Example
```html
<div class="row" data-fred-class="visible-grid"></div>
```

### data-fred-bind
Value of the element will copy from other element.

#### Example
```html
<div contenteditable="true" data-fred-name="name">John Doe</div>
<div class="modal">
    <div class="modal-header" data-fred-bind="name"></div>
    <div class="modal-content">Hello there</div>
</div>
```

### data-fred-on-drop
Name of the globally accessible function that should be called when this element is dropped to any dropzone. The function will receive fredEl as a first attribute.

#### Example
```html
<div class="clock" data-fred-on-drop="initClock">
```

### data-fred-on-setting-change
Name of the globally accessible function that should be called when element setting changes. The function will receive fredEl as first attribute.

#### Example
```html
<div class="clock" data-fred-on-setting-change="reInitClock"></div>
```