# Overriding Option Sets

Use cases for overriding an option set are when you need to change things like switching `remote` from `true` to `false`. You can also use them more extensively like overriding all the Settings for a single Element without maintaining an entierly separate Option Set.

Overrides are located on the `Overrides` tab when editing a specific Element in the Fred Manager page.

**Note:** You must include _all_ settings you want to show as controls in the Override panel. The best way to start your override is by copying the entire settings JSON node by clicking the `Preview Option Set` button and selecting the JSON object(s) and pasting into the overrides text area.   

## Example 

Assume you have an Intro plan with a background image and a call to action link. You want a version for both single-page sites with anchor link external URLs on the page, but also one which allows links to other Fred pages on your site. You don't need the scroll-to-link (see below) and you want to change the link object to be a MODX page select list.

### Original Setting

```
{
  "settings": [
    {
      "name": "image",
      "label": "Background Image",
      "type": "image",
      "value": "assets/themes/starter/img/Fred-hero.jpg"
    },
    {
      "fred-import": "background_settings
    },    
    {
      "name": "linkscroll",
      "label": "Scroll Link",
      "type": "toggle",
      "value": true
    },
    {
      "name": "link",
      "label": "Link anchor or URL",
      "type": "text",
      "value": null
    }
  ]
}
```

### Options Override

```
{
  "settings": [
    {
      "name": "image",
      "label": "Background Image",
      "type": "image",
      "value": "assets/themes/starter/img/Fred-hero.jpg"
    },
    {
      "fred-import": "background_settings
    },    
    {
      "name": "link",
      "label": "Link",
      "type": "page",
      "value": {
        "id": 1,
        "url": "[[~1]]"
      }
    }
  ]
}
```