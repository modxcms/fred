# JavaScript Events

## FredElementDrop

This event will trigger when any Element is dropped to a dropzone. You can access fredEl from the `event.detail.fredEl` object.

### Example {id="example_1"}

```javascript
document.body.addEventListener("FredElementDrop", function(){
    $owl();
});
```

## FredElementSettingChange

This event will trigger when Element setting on any Element is changed. You can access fredEl from the `event.detail.fredEl` object.

### Example {id="example_2"}

```javascript
document.body.addEventListener("FredElementSettingChange", function(){
    $owl();
});
```

## Full Featured Example

Here's an example use case of re-applying a jQuery class for a slider when changes are made.

### Slider Element

The slider element will create new or fewer slides based on the number defined in the element's options.

#### Markup

```html
<div class="col-md-8 owl-init slider-main owl-carousel">
    {% for i in 0..(slides - 1) %}
        <div class="item-slide">
            <div class="card-banner" style="height:600px;">
                <div class="overlay-cover d-flex align-items-center justify-content-center">
                    <div class="text-center">
                        <h3 data-fred-name="slider_header{{i}}">Default Value {{i+1}}</h3>
                        <p data-fred-name="slider_text{{i}}">This is some default text.</a>
                    </div>
                </div>
            </div>
        </div>
    {% endfor %}
</div>
```

#### Options

```json
{
  "settings": [
    {
      "name": "slides",
      "label": "Slides",
      "type": "slider",
      "value": 3,
      "min": 1,
      "max": 6
    }
  ]
}
```

### Template Script

The template will initialize the slider on first load, and re-initialize when the element is dropped or altered.

```html
<link rel="stylesheet" href="//unpkg.com/owl.carousel/dist/assets/owl.carousel.min.css" />
<link rel="stylesheet" href="//unpkg.com/owl.carousel/dist/assets/owl.theme.default.min.css" />
<script src="//unpkg.com/jquery/dist/jquery.js"></script>
<script src="//unpkg.com/owl.carousel/dist/owl.carousel.js"></script>
<script>
    var $owl = function(){
        $('.owl-carousel').owlCarousel({
        loop:true,
        margin:10,
        nav:true,
        items:1
      });
    };
    document.body.addEventListener("FredElementDrop", function(){
      $owl();
    });
    document.body.addEventListener("FredElementSettingChange", function(){
      $owl();
    });
    $(document).ready(function(){
      $owl();
    });
</script>
```
