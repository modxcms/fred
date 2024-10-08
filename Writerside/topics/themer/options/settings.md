# Options Detailed

Option Sets can have global settings for things like Media Sources and controlling whether or not dynamic asynchronous XHR calls should occur. The visual Settings that display in the browser, can also have sub-sets that serve to keep things organized.

## Global Settings

The followng control individual settings and grouping for an Element in a Fred-powered page.

### remote

Set to `true` to cause XHR requests to render the Element through both the Twig and MODX parsers. The element also re-renders through both the Twig and MODX parser when you change element settings. This means you can have dynamic content that references other pages within a Fred page using MODX Snippets. Default: `false`.

### cacheOutput

This will cache output of an element to static HTML when set to `true` and when the previous `remote` global setting is also set to `true`.

### mediaSource

Name of the Media Source to use for Finder. Multiple Names can be passed separated by comma `,`.

### imageMediaSource

Name of the Media Source to use for Image fields. Multiple Names can be passed separated by comma `,`. This option overrides `mediaSource`.

### toolbarPluginsInclude

List of toolbar plugins to enable for elements.

### toolbarPluginsExclude

List of toolbar plugins to disable for elements.

## Settings

Settings are made of a JSON array of objects and [group objects](#setting-groups) which provide configuratin controls for Elements. Settings can [import](import.md) sub-sets of settings using a `fred-import` object.

### Settings properties

The following properties apply to all settings, regarless of the types below:

- `name` - Name of the setting, can be used as a Twig variable
- `label` - Setting's Label, displayed in the Element Settings panel
- `value` - A default value
- `type` - Type of the setting, see next section

Note: for the best end-user experience, it is a good idea to set a default value so end users have a starting point to work with. Otherwise it may be confusing due to having a blank Element that may not match the preview image when dragging and dropping into pages.

### Available Settings types

The following Settings types are used to configure Elements in Fred.

#### text
![option_text](option_text.png)

- A single-line HTML `<input type="text">` element
- Can have any text value
- **Returns** - A string

#### textarea
![option_textarea.png](option_textarea.png)

- A multie-line HTML `<textarea>` element
- Can have any text value
- Type specific properties:
  - `rows` - The number of rows to show; Default: 4
- **Returns** - A string

#### select
![option_select.png](option_select.png)

- An HTML `<select>` list element
- Only supports a single select value
- Type specific properties:
  - `options` - An object of `"value":"label"` properties
- **Returns** - A string with the selected value

#### toggle
![option_toggle.png](option_toggle.png)

- true/false checkbox
- **Returns** - A logical `true` or `false` (`0` or `1` if output as a string)

#### togglegroup
![option_togglegroup.png](option_togglegroup.png)

- A checkbox group
- Type-specific properties:
  - `options` - An object of `"value":"label"` properties
- **Returns** - A double-pipe `||` separated string of checked values

#### colorswatch
![option_colorswatch.png](option_colorswatch.png)

- Visual color picker, to choose from predefined values
- Type-specific properties:
  - options
    - An array of colors; Example: `["lightcoral", "red", "black"]`
    - Color can be either a `string` or an `object` with following properties:
      - `value` - the value passed to Twig for the color, which can be anything
      - `color` - the displayed color for the swatch
      - `colorAsClass` - if set to `true` the `color` value will be added as a class to the option, instead of setting as a background
      - `label` - an arbitrary label for the swatch
      - `width` - width of the color option, default is `1`
- **Returns** - A string of the color value
  
#### colorpicker
![option_colorpicker.png](option_colorpicker.png)

- A color picker that supports arbitrary color definitions including RGB, HSL or Hex values with optional opacity
- Type-specific properties:
  - `showAlpha` - A boolean to show an alpha transparency slider; Default: `true`
  - `options` - An array of colors; Example: `["lightcoral", "red", "black"]`
- **Returns** - A string of the color's hexadecimal value

#### slider
![option_slider.png](option_slider.png)

- An input slider for numbers
- Type-specific properties:
  - `min` - **REQUIRED**: The minimum value of the slider
  - `max` - **REQUIRED**: The maximum value of the slider
  - `tooltipDecimals` – Number of decimals to show in the slider’s tooltip; Default: 0
  - `step` – A number to increment the slider’s value; Default: 1
- **Notice:** To avoid issues with this option, set a default `value` within the range of `min` and `max`
- **Returns** - A number

#### page
![option_page.png](option_page.png)

- MODX Page select
- Type-specific properties:
  - `clearButton` - If set to `true` an `x` button shows in the input field allowing a user to clear any set value
  - `resources` - If set, only resource with specified IDs will show; Value can be string with a comma as a separator or an array
  - `parents` - If set, only resource from these parents (including parents itself) will show; Value can be string with a comma as a separator or an array
  - `depth` - Depth to look for children for specified `parents`; Default: 1
- **Returns** - An object with `id` and `url` properties
    - Referencing ID or URL alone is done through the dot syntax: `{{ page-name-example.id}}`

#### chunk
![option_chunk.png](option_chunk.png)
- Chunk select
- Type-specific properties:
    - `chunks` - Comma separated list of chunk names/ids to show
    - `category` - Comma separated list of category names/ids to show chunks from
- **Returns** - An object with `id` and `name` properties
    - Referencing ID or URL alone is done through the dot syntax: `{{ chunk-name-example.name}}`

#### file
![option_file.png](option_file.png)

- File picker
- Type-specific property:
  - `mediaSource` - Optional name of the Media Source to use that overrides the top-level ```<a href="#mediasource">`mediaSource` global setting</a>```
- **Returns** - A string of the file path

#### folder
![option_folder.png](option_folder.png)

- Folder picker
- Type-specific property:
  - `mediaSource` - Optional name of the Media Source to use that overrides the top-level  ```<a href="#mediasource">`mediaSource` global setting</a>```
  - `showOnlyFolders` - If set to `true` only folder will be visible in the elFinder; Default: false
- **Returns** - A string of the folder path

#### image
![option_image.png](option_image.png)

- Image select
- Type-specific properties:
  - `showPreview` - If set to `false` preview won't appear under the text input
  - `mediaSource` - Optional name of the Media Source to use that overrides the top-level ```<a href="#imagemediasource">`imageMediaSource` global setting</a>```
- **Returns** - A string of the image path


#### tagger
![option_tagger.png](option_tagger.png)
- Allows users to choose from preset Tagger tags
- Type-specific properties:
  - `group` - **REQUIRED** An ID of the Tagger group to use
  - `autoTag` - true/false to show/hide the auto tag
  - `hideInput` - true/false to show/hide the input
  - `limit` - Maximum limit of the number of tags that can be selected
- **Returns** - A string of comma-separated tag names

### Setting Groups

Groups are used to organize related Option Sets, or to remove infrequently used settings from the main view.

- `group` - Name of a group of related sub-settings that open when clicked in a secondary panel. The value of the group property will be used as the label for the group
- `settings` - An array of setting objects

```json
{
    "group": "Group Name",
    "settings": [
        {
            …
        },
        {
            …
        }
    ]
}
```

### Setting Name Conventions

Since the frontend is rendered through Twig, all `"name"` values need to follow JavaScript conventions. This primarily means hyphens, spaces and other special characters are not allowed as they may have reserved functions in JavaScript. 

#### Joining Multiple Words in Setting Names

**Underscore:**

cta_title, cta_image, cta_link

**Upper Camel Case (Pascal Case):**

CtaTitle, CtaImage, CtaLink

**Lower Camel Case:**

ctaTitle, ctaImage, ctaLink

## Example Option Set with Settings

```json
{
    "remote": true,
    "settings": [
        {
            "name": "panel_class",
            "label": "Panel Classes",
            "type": "text",
            "value": "col-6 col-sm-12"
        },
        {
            "name": "logo",
            "label": "Logo",
            "type": "image",
            "mediaSource": "site-assets",
            "value": "assets/images/logo.svg"

        },
        {
            "name": "nda-file",
            "label": "Upload NDA",
            "type": "file",
            "mediaSource": "site-assets-files",
            "value": "assets/files/contract.pdf"

        },
        {
            "name": "slogan",
            "label": "Slogan",
            "type": "textarea",
            "value": "Enter your slogan here"
        },
        {
            "name": "panel_type",
            "label": "Type of Panel",
            "type": "select",
            "options": {"info":"Info Panel", "warn":"Warning Panel","error":"Error panel"},
            "value": "info"
        },
        {
            "name": "padding_top",
            "label": "Top padding",
            "type": "slider",
            "min": 0,
            "max": 100,
            "step": 10,
            "value": 20
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
                    "label": "Linked Page",
                    "type": "page",
                    "value": {"id":1, "url": "[[~1]]"}
                }
            ]
        }
    ]
}
```
