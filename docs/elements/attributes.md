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
Defines Resource field to store content. Content of the HTML element will be stored in regular Content field and additionally in the specified target. Valid targets include any standard content fields like Pagetitle, Longtitle or Description, or any Template Variable that stores its value purely as text. 

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