Fred elements are crafted in pure HTML with specific attributes. The markup can be enhanced using Twig and Element Settings.

### Markup Example
```html
<!-- Simple Element -->
<div class="panel">
    <p contenteditable="true" data-fred-name="header_text">Default Value</p>
    <img src="http://via.placeholder.com/450x150" data-fred-name="header_image">
</div>

<!-- Enhanced Element -->
<div class="panel {{ panel_class }}">
    <p contenteditable="true" data-fred-name="panel_text">Default Value</p>
    
    {% if cta_link %}
    <a class="btn {{ cta_class }}" href="{{ cta_link }}">{{ cta_text }}</a>
    {% endif %}
</div>
```