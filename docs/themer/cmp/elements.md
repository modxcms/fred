# Elements

Elements are the basic building blocks for creating Fred pages.

## Creating an Element

The following are the properties for an Element:

- **Name** - Required. What you wish to call the Element.
- **Description** - Optional. A brief description for the Element.
- **Image** - Required. If you do not specify an image, a default gray box with the Element name will be created for you. Images are used as the sources for dragging and dropping Elements into your Layouts.
- **Category** - Required. Which category to place this Element under.
- **Rank** - Optional. The order you wish this Element to show in its category.
- **Markup** - Optional. HTML + Twig markup for the Element, including [Fred-specific attributes](../elements/attributes.md) which allow you to control things like save targets, visibility when creating or viewing content, etc.
- **Option Set** - Optional. Complete Option Set can be selected here
- **Options Override** - Optional. Override selected Option Set, or define one time options for this Element

![Element Panel](img/element_panel.png)

![Element Panel Options](img/element_panel_options.png)

## Element Preview Images

Element Previews are thumbnail images used to drag-and-drop onto pages. You can create your own images/previews/screengrabs for Elements from the back end CMP or from the front end when using Fred.

In the Manager CMP, you can upload images using the built-in MODX file manager. By default, the Element’s name centered in a gray box will be created. 

Users with the "Take Screenshot" permission can also create Element previews from the front end. This is useful for creating the exact preview image you want for your theme. 

- The most convenient way is to configure an Element for the preview image then take a screenshot using a built-in utility on your computer. When the screenshot is available in your system clipboard and the Element Preview Image is showing in the sidebar, simply paste to upload and process the image to the appropriate size (540px wide).
- You can also drag and drop an image from your local computer to the Element’s preview image
- Or, you can click the Element Preview to upload a new one using your local computer file browser

Starting in version 1.2, existing Element Previews will be removed once you replace them. 

## Updating Elements

Elements are like master templates which can be updated at any time. When an Element’s markup or option set is updated, all places in a site should update to reflect these changes.

To see the updated results, either resave the page, or use the "Rebuild" tab in the Fred 3PC.
