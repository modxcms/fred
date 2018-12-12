# Convert an Existing MODX Site to Fred

Fred allows you to convert existing standard resources into Fred resources. You can make Fred as open or restricted as you want when it comes to controlling the layout of a page. It is possible to just limit Fred to a set content area, similiar to how you would use an RTE currently.

## Tips
Here are some tips for converting your site to Fred.

### Default Element
When converting existing pages to Fred, you will want to specify a *Default Element* in the Themes grid, [see documentation](/themer/cmp/themes.md). Without a default element set, your content will disappear when switching a resource to Fred. 

The Default Element works by detecting there are no Fred elements currently in place, then selecting the default element and putting any content from the resource into the object specified by the `data-fred-name` option.  

### Templates
Generally, you will want to create a new template or duplicate an existing template when converting content to Fred. This way you can maintain a hybrid and not potentially break content during the transition.

### Themes
One important note about themes is that multiple Templates can be specified per theme, but if a Fred resource is changed to a Template with a different theme, it has the potential to lose its elements. This is because Elements are assigned to a specific theme, so the new theme wouldn't have access to the old elements.