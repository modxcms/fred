Fred system settings control how your site reacts. Since Fred is loaded on the frontend, you can change how these works per-context, user, or group.

### Blueprint Sort (fred.blueprint_sort)

By default blueprints are sorted by `name`, but you can switch it to use the `rank` if you want them to be sorted in a specific order.

### Blueprint’s Category Sort (fred.blueprint_category_sort)

By default blueprint categories are sorted by `name`, but you can switch it to use the `rank` if you want them to be sorted in a specific order.

### Fred Enabled (fred.default_enabled)

By default Fred is loaded in an active state whenever someone opens a page. Changing this setting to `No` will start Fred as disabled until it is turned on in the user's session.

### Element’s Group Sort (fred.element_sort)

By default Element are sorted by `name`, but you can switch it to use the `rank` if you want them to be sorted in a specific order.

### Element’s Group Sort (fred.element_group_sort)

By default Element categories are sorted by `name`, but you can switch it to use the `rank` if you want them to be sorted in a specific order.

### Icon Editor (fred.icon_editor)

Fred can use plugins that tap into different Element types. The Icon Editor targets `<i>` Elements that also have a `data-fred-name` attribute.

### Image Editor (fred.image_editor)

Fred can use plugins that tap into different Element types. The Image Editor targets `<img>` Elements that also have a `data-fred-name` attribute.

### Position of Launcher (fred.launcher_position)

The Fred launcher can be positioned in any corner of the site to prevent hiding an Element on your design. Options include: `bottom_left`, `bottom`, `bottom_right`, `top_left`, `top`, and `top_right`.

### Rich Text Editor (fred.rte)

Fred can use plugins that tap into different Element types. The Image Editor targets any wrapper Elements that also have a `data-fred-name` attribute and are set to `data-fred-editable="true" data-fred-rte="true"`.

### Secret (fred.secret)

This is an automatically generated key used for signing XHR requests.
