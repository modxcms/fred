# Option Sets

Option Sets allow you to create common configurations and frequently used sub-configs (e.g., set of settings, use of media sources, remote render) for use across multiple Elements.

## Complete

Each Option Set has a `complete` flag. If this flag is set to `Yes` the Option Set can be attached to an [Element](/elements).

Option Sets with `No` in this flag are meant to be used for including to other Option Sets. You can define repeatable list of settings or specific options that are going to repeat across multiple Option Sets.

## Available Options

### remote
If set to `true` XHR request will be fired to render the Element through both Twig and MODX parsers. This means you can have dynamic content that references other pages within a Fred page using MODX Snippets.

### mediaSource
Name of the Media Source to use for Finder. Multiple Names can be passed separated by comma `,`.

### imageMediaSource
Name of the Media Source to use for Image fields. Multiple Names can be passed separated by comma `,`. This option overrides `mediaSource`.

### settings
An array of setting objects and group objects for the Fred Element. Settings can also contain a special import object, to import another option set.

#### Available group properties
- group - Name of a group of related sub-settings that open when clicked in a secondary panel. The value of the group property will be used as the label for the group
- settings - An array of setting objects

#### Available setting properties
- name - Name of the setting, can be used as a Twig variable
- label - Setting's Label, displayed in the Element Settings panel
- type - Type of the setting
- value - Default value

#### Available types
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
        - Refrencing ID or URL alone is done through the dot syntax: `{{ page-name-example.id}}`
    - Type specific properties:
        - clearButton - If set to `true` button to clear select will appear
        - parents - If set, only resource from these parents (including parents itself) will show; Value can be string with a comma as a separator or an array
        - resources - If set, only resource with specified IDs will show; Value can be string with a comma as a separator or an array
        - depth - Depth to look for children for specified `parents`; Default: 1
- image
    - Image select
    - Type specific properties:
        - showPreview - If set to `false` preview won't appear under the text input
        - mediaSource - Name of the Media Source to use; Overrides `imageMediaSource` global setting.  
- tagger
    - Select for Tagger tags
    - Type specific properties:
        - autoTag - true/false to show/hide the auto tag
        - hideInput - true/false to show/hide the input
        - group - ID of the Tagger group to use
        - limit - Limit of tags that can be selected

#### Example
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

## Import
Importing another Option Set is done with a special object with `fred-import` key. 

- Only not complete Option Sets can be imported
- Import only works for settings


### Full import

#### Complete Option Set
```json
{
    "settings": { 
      "fred-import": "all_settings"
    }
    
}
```

#### All Settings Option Set
```json
[
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
```

### Partial import

#### Complete Option Set
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
            "fred-import": "cta"
        },
        { 
             "fred-import": "text_color"
        }
    ]
    
}
```

#### CTA Option Set
```json
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
```

#### Text Color Option Set
```json
{
    "name": "color",
    "label": "Text Color",
    "type": "colorswatch",
    "value": "black",
    "options": [{"value":"primary", "color":"blue","label":"Primary"}, "lightcoral", "black", "rgba(0,255,0,.5)"]
}
```