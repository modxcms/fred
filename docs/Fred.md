# Fred

## Elements

### Markup
Fred elements are crafted in pure HTML with a usage of few extra attributes and data attributes. The regular HTML can be enhanced using Twig and Element Settings.

##### Example
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

### Options
JSON object of specific options for the Fred Element.

##### Example
```json
{
    "remote": true,
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
If set to `true` XHR request will be fired to render Fred's Element - element will be parsed through Twig in PHP including MODX tags.

#### settings
An array of setting objects and group objects for the Fred Element.

**Available group properties:**
- group - Name of the group
- settings - An array of setting objects

**Available setting properties:**
- name - Name of the setting, can be used as a Twig variable
- label - Setting's Label, displayed in the Element Settings panel
- type - Type of the setting
- value - Default value

**Available types:**
- text - Text value
- select
    - Single select value
    - Type specific properties:
        - options - An object of `value:label` properties
- toggle - true/false checkbox

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
Value of this attribute has to be unique across single Fred's Element.

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
If set to `false` HTML element won't appear when Fred is not loaded. Usable for showing messages only to Fred users.

##### Example
```html
<p data-fred-render="false">This will be visible only when Fred is loaded</p>
```

#### data-fred-target
Defines Resource field to store content. Content of the HTML element will be stored in regular Content field and additionally in the specified target.

##### Example
```html
<h1 data-fred-name="title" data-fred-target="pagetitle" contenteditable="true">Default Page Title</h1>
```

#### data-fred-rte
If set to `true` Rich Text Editor will be loaded for the editable HTML element.

##### Example
```html
<div data-fred-name="rte-content" contenteditable="true" data-fred-rte="true">Default Content</div>
```

#### data-fred-dropzone
Defines a new Drop Zone for Fred Elements. This attribute can't be empty and has to be unique across single Fred's Element.

##### Example
```html
<div data-fred-dropzone="left" class="left-content"></div>
<div data-fred-dropzone="right" class="right-content"></div>
```