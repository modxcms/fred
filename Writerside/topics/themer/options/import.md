# Importing Partial Option Sets

Importing an Option Set is done with a specific with a `fred-import` key in the JSON import object.

- Only partial Option Sets can be imported
- Import only works for Settings
- The entire import object will be replaced by the

## Full import

The use case for a full import, versus defining a complete Option Set, is if you have a base set of options that are identical across many Elements, including one that _only_ uses the base options. An example of this would be a site that has call to action buttons in many Elements, including one that is just a single CTA button.

### Full Settings import for a CTA-button-only Element

```json
{
    "settings": {
      "fred-import": "cta_settings"
    }
}
```

### `cta_settings` partial Option Set

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

## Partial import

You can import specfic frequently used partial option sub-sets into a Complete Option Set.

### Complete Option Set

Note, the `cta_settings` import is defined above.

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
            "fred-import": "cta_settings"
        },
        {
             "fred-import": "text_color"
        }
    ]
}
```

### `text_color` partial Option Set

```json
{
    "name": "color",
    "label": "Text Color",
    "type": "colorswatch",
    "value": "black",
    "options": [
      {
        "value":"primary", 
        "color":"blue",
        "label":"Primary"
      }, 
      "lightcoral", 
      "black", 
      "rgba(0,255,0,.5)"
    ]
}
```
