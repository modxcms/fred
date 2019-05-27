Fred system settings control how your site reacts. Since Fred is loaded on the frontend, you can change how these works per-context, user, or group.

#### Example Chunk: Content Area (13)

```html
<section class="container">
    <div data-fred-name="content" data-fred-rte="true">
    </div>
</section>
```

You would set the value to be `13|content`

### Element’s Group Sort (fred.element_group_sort)

By default Element categories are sorted by `name`, but you can switch it to use the `rank` if you want them to be sorted in a specific order.

### Blueprint Sort (fred.blueprint_sort)

By default blueprints are sorted by `name`, but you can switch it to use the `rank` if you want them to be sorted in a specific order.

### Blueprint’s Category Sort (fred.blueprint_category_sort)

By default blueprint categories are sorted by `name`, but you can switch it to use the `rank` if you want them to be sorted in a specific order.

### Icon Editor (fred.icon_editor)

Fred can use plugins that tap into different Element types. The Icon Editor targets `<i>` Elements that also have a `data-fred-name` attribute.

### Image Editor (fred.image_editor)

Fred can use plugins that tap into different Element types. The Image Editor targets `<img>` Elements that also have a `data-fred-name` attribute.

### Position of Launcher (fred.launcher_position)

The Fred launcher can be positioned in any corner of the site to prevent hiding an Element on your design. Options include: `bottom_left`, `bottom`, `bottom_right`, `top_left`, `top`, and `top_right`.

### Rich Text Editor (fred.rte)

Fred can use plugins that tap into different Element types. The Image Editor targets any wrapper Elements that also have a `data-fred-name` attribute and are set to `data-fred-editable="true" data-fred-rte="true"`.
