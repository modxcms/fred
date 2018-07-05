Fred system settings control how your site reacts. Since Fred is loaded on the frontend, you can change how these works per-context, user, or group.

### Default Element

The default element settings allows you to chose a default Fred element and target area for placing the content on existing documents. The setting is formatted as `ID|target` where ID is the identification number of the element and the target is the named element within that element to place the content.

E.g. Chunk: Content Area (13)

```
<section class="container">
    <div contenteditable="true" data-fred-name="content" data-fred-rte="true">
    </div>
</section>
```
You would set the value to be `13|content`


### Element's Group Sort

By default element categories are sorted by `name`, but you can switch it to use the `rank` if you want them to be sorted in a specific order.

### Element's Category ID

To display, Fred needs to be fed an Element Category ID, which can be found in the "Categories" section of the Elements tab. The Element Category also needs sub-categories to display properly. Any chunks left un-categorized will not display.

### Icon Editor

Fred can use plugins that tap into different element types. The Icon Editor targets `<i>` elements that also have a `data-fred-name` attribute.

### Image Editor

Fred can use plugins that tap into different element types. The Image Editor targets `<img>` elements that also have a `data-fred-name` attribute.

### Position of Launcher

The Fred launcher can be positioned in any corner of the site to prevent hiding an element on your design. Options include: `bottom_left`, `bottom`, `bottom_right`, `top_left`, `top`, and `top_right`.

### Rich Text Editor

Fred can use plugins that tap into different element types. The Image Editor targets any wrapper elements that also have a `data-fred-name` attribute and are set to `contenteditable="true" data-fred-rte="true"`.

### Template IDs

The Template IDs are a comma separated list of templates to launch Fred on. Fred Templates can not have the content area edited in the backend, and existing templates that are switched to Fred Templates will have the content wrapped in the *Default Element*.
