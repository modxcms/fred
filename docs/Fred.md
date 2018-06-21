# Fred
Meet Fred, the friendly editor. Fred helps designers, developers and content creators to collaborate on MODX projects through a powerful and flexible drag-and-drop visual website builder. Designers create the specifications of how a site should look and work. Developers create a reusalble design libraries for sites. And the ultimate site owners can then use that work to create compelling content quickly using intuitive, visual drag and drop tools straight from the front end of a website.

Sinces there are _zero_ restriction on markup, techniques or templates, designers can realize their creative vision with pixel-perfect precision. Complete control over what can and cannot be edited means developers can create a library of design elements based on designers’ work without worrying that end-users will break things. And end-users are empowered to quickly create amazing web content without the need to get designers and developers involved (or fear of retribution if they break things).

## How Fred Works
To create content with Fred, users drag design elements (“Elements”) from a sidebar, drop them where desired on a page, and edit the settings and content inline without ever having to visit a back-end admin tool. Fred has a variety of features that in combination make it an incredibly powerful visual content builder:

- transform static Design Pattern Libraries into dynamic building blocks that accelerate the time needed to create content that adheres to brand standards
- developers can use standard HTML markup with `data-fred-` attributes in Elements to create virtually any type of standard design library pattern 
- optional Twig templating logic
- unlimited categories for Elements
- a variety of controls including toggles, text inputs, date pickers, select inputs, radio inputs (TODO), sliders (TODO), Resource pickers (TODO) and color pickers (TODO) for end-users to configure Elements as they create new content
- support for Snippets in Elements with real-time Ajax-based rendering when settings are updated
- visual Font Awesome 5 icon picker (TBD) (other icon choosers can be created) 
- simple content formatting with a currated default TinyMCE rich text editor (others RTEs can be used)
- drag-and-drop to rearrange existing Elements on a page to new locations any time
- nested Elements to enable [Atomic Web Design](http://bradfrost.com/blog/post/atomic-web-design/) workflows
- ships with a complete set of production-ready Bootstrap 4 Elements (TODO)
- end-user content is completely processed and cached for blazing fast page load times

## Elements

### Markup
Fred elements are crafted in pure HTML with specific attributes. The markup can be enhanced using Twig and Element Settings.

##### Markup Example
```html
<!-- Simple Element -->
<div class="panel">
    <p contenteditable="true" data-fred-name="header_text">Default Value</p>
    <img src="http://via.placeholder.com/450x150" data-fred-name="header_image">
</div>

<!-- Enhanced Element -->
<div class="panel {{ panel_class }}">
    <p contenteditable="true" data-fred-name="panel_text">Default Value</p>
    
    {% if cta_link %}
    <a class="btn {{ cta_class }}" href="{{ cta_link }}">{{ cta_text }}</a>
    {% endif %}
</div>
```

### Element Settings
JSON object of specific options for the Fred Element.

#### Example
```json
{
    "remote": true,
    "mediaSource": "1,2",
    "imageMediaSource": 3,
    "settings": [
        {
            "name": "panel_class",
            "label": "Panel Class",
            "type": "text",
            "value": ""
        }
    ]
}
```

#### remote
If set to `true` XHR request will be fired to render the Element through both Twig and MODX parsers. This means you can have dynamic content that references other pages within a Fred page using MODX Snippets.

#### mediaSource
ID of the Media Source to use for Finder. Multiple IDs can be passed separated by comma `,`.

#### imageMediaSource
ID of the Media Source to use for Image fields. Multiple IDs can be passed separated by comma `,`. This option overrides `mediaSource`.

#### settings
An array of setting objects and group objects for the Fred Element.

**Available group properties:**
- group - Name of a group of related sub-settings that open when clicked in a secondary panel. The value of the group property will be used as the label for the group
- settings - An array of setting objects

**Available setting properties:**
- name - Name of the setting, can be used as a Twig variable
- label - Setting's Label, displayed in the Element Settings panel
- type - Type of the setting
- value - Default value

**Available types:**
- text 
    - `input type="text"`
    - any text value
- select
    - Single select value
    - Type specific properties:
        - options - An object of `value:label` properties
- toggle 
    - true/false checkbox
    - returns logical `true` or `false`
    
- colorswatch
    - Visual color picker, from predefined values
    - Type specific properties:
        - options 
            - An array of colors; Example: `["lightcoral", "red", "black"]`
            - Color can be either a `string` or an `object` with following properties:
                - value - the value passed to Twig for the color, which can be anything
                - color - the displayed color for the swatch
                - label - an arbitrary label for the swatch

- colorpicker
    - Color picker
    - Type specific properties:
        - showAlpha - boolean to show alpha slider; Default: `true`
        - options - An array of colors; Example: `["lightcoral", "red", "black"]`
- slider
    - Slider input for numbers
    - Type specific properties:
        - min - **REQURED**; Minimum value of the slider
        - max - **REQURED**; Maximum value of the slider
        - tooltipDecimals: Number of decimals to show in slider's tooltip; Default: 0
        - step: Number to increment slider's value; Default: 1
- page
    - MODX Page select
    - Value is returned as an object in format: `{"id": 1, "url": "fred.html"}`
    - Type specific properties:
        - clearButton - If set to `true` button to clear select will appear
        - parents - If set, only resource from these parents (including parents itself) will show; Value can be string with a comma as a separator or an array
        - resources - If set, only resource with specified IDs will show; Value can be string with a comma as a separator or an array
        - depth - Depth to look for children for specified `parents`; Default: 1
- image
    - Image select
    - Type specific properties:
        - showPreview - If set to `false` preview won't appear under the text input
        - mediaSource - ID of the Media Source to use; Overrides `imageMediaSource` global setting.  
- tagger
    - Select for Tagger tags
    - Type specific properties:
        - group - ID of the Tagger group to use
        - limit - Limit of tags that can be selected

##### Example
```json
{
    "settings": [
        {
            "name": "panel_class",
            "label": "Panel Class",
            "type": "text",
            "value": ""
        },
        {
            "group": "CTA",
            "settings": [
                {
                    "name": "cta_class",
                    "label": "CTA Class",
                    "type": "select",
                    "options": {
                        "danger": "Red CTA",
                        "info": "Blue CTA",
                        "default": "Default CTA"
                    },
                    "value": "default"
                },
                {
                    "name": "show_cta",
                    "label": "Show CTA",
                    "type": "toggle",
                    "value": false
                },
                {
                    "name": "color",
                    "label": "Text Color",
                    "type": "colorswatch",
                    "value": "black",
                    "options": [{"value":"primary", "color":"blue","label":"Primary"}, "lightcoral", "black", "rgba(0,255,0,.5)"]
                },
                {
                    "name": "bg_color",
                    "label": "Background COlor",
                    "type": "colorpicker",
                    "value": "white",
                    "showAlpha": true,
                    "options": ["lightcoral", "black", "white"]
                },
                {
                    "name": "page",
                    "label": "Page",
                    "type": "page",
                    "value": {"id":1, "url": "[[~1]]"}
                }
            ]
        }
    ]
}
```

### Attributes
Currently available attributes for Fred elements.

#### contenteditable
If set to `true` the content of the HTML element will be editable for the user, including all children.
This attribute has to be used with `data-fred-name` to save the value.

##### Example
```html
<p contenteditable="true" data-fred-name="description">Default value</p>
```

#### data-fred-name
Name for the editable HTML element. Only elements with this attribute will be saved.
Value of this attribute has to be unique across a single Element, but you can have multiple instances of an Element on pages.

##### Example
```html
<!-- Simple editable paragraph -->
<p contenteditable="true" data-fred-name="description">Default value</p>

<!-- Editable image -->
<img src="http://via.placeholder.com/450x150" data-fred-name="header-image">
```

#### data-fred-attrs
Defines other HTML attributes (comma separated) to save with the content of the HTML element. 

##### Example
```html
<img src="http://via.placeholder.com/450x150" alt="Default Alt" data-fred-name="header-image" data-fred-attrs="alt">
```

#### data-fred-render
If set to `false` HTML element won't appear when Fred is not loaded. This allows developers to create user-friendly, self-documenting Elements that inform users what they need to do in order to create content.

##### Example
```html
<p data-fred-render="false">Add a *Link Location* setting for this Element to make the button appear. (This will be visible only when Fred is used to create content.)</p>
```

#### data-fred-target
Defines Resource field to store content. Content of the HTML element will be stored in regular Content field and additionally in the specified target. Valid targets include any standard content fields like Pagetitle, Longtitle or Description, or any Template Variable that stores its value purely as text. 

##### Example
```html
<h1 data-fred-name="title" data-fred-target="pagetitle" contenteditable="true">Default Page Title</h1>
```

#### data-fred-rte
If set to `true` the Rich Text Editor will be loaded for the editable HTML element.

##### Example
```html
<div data-fred-name="rte-content" contenteditable="true" data-fred-rte="true">Default Content</div>
```

#### data-fred-dropzone
Defines a new Drop Zone for Fred Elements. This attribute cannot be empty and has to be unique across a single Element. You can create an unlimited number of Dropzones, though more than a few might get quite cumbersome. This is useful for creating alternate layouts like full width, split pages, sidebar pages, etc.

##### Example
```html
<div data-fred-dropzone="left" class="left-content"></div>
<div data-fred-dropzone="right" class="right-content"></div>
```

#### data-fred-link-type
Sets a type for a link, used for processing before generating content. Available values: `page`
Used together with other `data-fred-link-` attributes.

##### Example
```html
<a href="fred.html" data-fred-link-type="page" data-fred-link-page="2">Fred</a>
```

#### data-fred-link-page
Defines ID of MODX Resource. Value of this attribute will be used as a link's href (in MODX format `[[~ID]]`) when content is generated.

##### Example
```html
<a href="fred.html" data-fred-link-type="page" data-fred-link-page="2">Fred</a>
```

#### data-fred-media-source
This option override globals from Element Settings.

Defines Media Source to be used for the element. ID of the media source is expected and can accommodate multiple IDs separated by comma `,`.

##### Example
```html
<img src="http://via.placeholder.com/450x150" data-fred-name="header-image" data-fred-media-source="1,2">
```

#### data-fred-image-media-source
This option override globals from Element Settings and `data-fred-media-source` (but only for images).

Defines Media Source to be used for the element. ID of the media source is expected and can accommodate multiple IDs separated by comma `,`.

##### Example
```html
<img src="http://via.placeholder.com/450x150" data-fred-name="header-image" data-fred-image-media-source="1,2">
```
