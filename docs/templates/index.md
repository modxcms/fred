Fred is only loaded by templates that have Theme attached (Extras > Fred > Themed Templates). Any resources using a template listed in that table will block access to the content area in the manager, and load Fred on the frontend.

### Dropzones

Currently, the only supported dropzone is *content*. In your Fred Template, you need to define where the content dropzone will be.

#### Example

```
<html>
<head>
    <title>[[*pagetitle]]</title>

</head>
<body >
    <div data-fred-dropzone="content" style="min-height: 200px;">
        [[*content]]
    </div>
</body>
</html>
```

We recommend setting a "min-height" property on your drop zone to make it easier to drop content in if it is empty.  The size of your min-height might change if you have competing or overlapping elements, such as a fixed top bar navigation.

The dropzone needs to have the attribute `data-fred-dropzone="content"` and needs to contain a reference to the `[[*content]]` tag inside of it.  When Fred loads, it clears out the content rendered in the dropzone, and loads it with element data. However, when Fred is not loaded, it just renders whatever tags you have in that area.