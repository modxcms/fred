# Rich Text Editor (RTE) Configs

*todo* @theboxer

The default RTE configuration for the TinyMCE Editor for Fred is as follows:

```json
{
    "theme": "inlite",
    "inline": true,
    "plugins": "modxlink image imagetools media lists",
    "insert_toolbar": "image media quicktable modxlink",
    "selection_toolbar": "bold italic underline | alignleft aligncenter alignright | bullist numlist | modxlink h2 h3 h4 blockquote",
    "image_advtab": true,
    "imagetools_toolbar": "alignleft aligncenter alignright | rotateleft rotateright | flipv fliph | editimage imageoptions",
    "auto_focus": false,
    "branding": false,
    "relative_urls": false,
    "image_dimensions": false
}
```

For an ultra-minimal streamlined RTE, for example for only allowing italics and bolding in headlines, you might use the following RTE config:

```json
{  
   "theme": "inlite";
   "inline": true,
   "selection_toolbar": "bold italic"
}
```

To learn more about plugins and options for TinyMCE, please see the [TinyMCE Examples & Demos](https://www.tiny.cloud/docs/demo/).
