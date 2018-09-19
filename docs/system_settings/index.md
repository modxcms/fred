Fred system settings control how your site reacts. Since Fred is loaded on the frontend, you can change how these works per-context, user, or group.

### Default Element (fred.default_element)

The default element settings allows you to chose a default Fred element and target area for placing the content on existing documents. The setting is formatted as `ID|target` where ID is the identification number of the Chunk and the target is the HTML element within that Chunk identified with a `data-fred-name` attribute.

#### Example Chunk: Content Area (13)

```html
<section class="container">
    <div contenteditable="true" data-fred-name="content" data-fred-rte="true">
    </div>
</section>
```
You would set the value to be `13|content`


### Element's Group Sort (fred.element_group_sort)

By default element categories are sorted by `name`, but you can switch it to use the `rank` if you want them to be sorted in a specific order.

### Blueprint Sort (fred.blueprint_sort)

By default blueprints are sorted by `name`, but you can switch it to use the `rank` if you want them to be sorted in a specific order.

### Blueprint's Category Sort (fred.blueprint_category_sort)

By default blueprint categories are sorted by `name`, but you can switch it to use the `rank` if you want them to be sorted in a specific order.

### Icon Editor (fred.icon_editor)

Fred can use plugins that tap into different element types. The Icon Editor targets `<i>` elements that also have a `data-fred-name` attribute.

### Image Editor (fred.image_editor)

Fred can use plugins that tap into different element types. The Image Editor targets `<img>` elements that also have a `data-fred-name` attribute.

### Position of Launcher (fred.launcher_position)

The Fred launcher can be positioned in any corner of the site to prevent hiding an element on your design. Options include: `bottom_left`, `bottom`, `bottom_right`, `top_left`, `top`, and `top_right`.

### Rich Text Editor (fred.rte)

Fred can use plugins that tap into different element types. The Image Editor targets any wrapper elements that also have a `data-fred-name` attribute and are set to `contenteditable="true" data-fred-rte="true"`.