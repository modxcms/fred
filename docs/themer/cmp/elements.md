# Elements

Elements are the fundamental starting point for 

## Creating Element
The following are the properties for each Element:

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

## Element images

Element images are thumbnail previews used to drag-and-drop onto pages. You can create your own images/previews/screengrabs for Elements, or Fred can create ones for you in one of two ways:

- a gray box with the Element’s name centered in the gray box (this is the default unless you provide an image)
- after an Element is used, and if you have the "Take Screenshots" permission, clicking the camera icon above the Element when focused.

**Note:** the library used to take screenshots is very good, but it doesn’t understand some CSS properties and may not render the screenshots optimially for your use case. For best results make sure that manual Element screenshots are 500px wide.

## Updating Elements

Elements are like master templates which can be updated at any time. When an Element’s markup or option set is updated, all places in a site should update to reflect these changes. 

To see the updated results, either resave the page, or use the "Rebuild" tab in the Fred 3PC.
