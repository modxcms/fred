# HTML Markup in Fred Elements

Fred Elements are made of HTML with specific attributes. The markup can be enhanced using Twig and Element [Settings](options_index.md).

## Custom Tags

### Template Theme Directory

To make themes more portable `{{template.theme_dir}}` can be used in an element as a dynamic placeholder reference to the template's theme directory (e.g. '/assets/theme/default/'.)

### Resource Fields

Resource fields can be accessed in the element markup object. For example, to access the pagetitle of the current resource, you would use `{{ pagetitle }}`.

### TV Fields

Template Variables can be accessed in the element markup object with the prefix `tv_`. For example, to access a TV named `myTV`, you would use `{{ tv_myTV }}`.


## Markup Examples

```html
<!-- Simple Element -->
<div class="panel">
    <p data-fred-name="header_text">Default Value</p>
    <img src="http://via.placeholder.com/450x150" data-fred-name="header_image">
</div>

<!-- Enhanced Element -->
<div class="panel {{ panel_class }}">
    <p data-fred-name="panel_text">Default Value</p>

    {% if cta_link %}
    <a class="btn {{ cta_class }}" href="{{ cta_link }}">{{ cta_text }}</a>
    {% endif %}
</div>
```
