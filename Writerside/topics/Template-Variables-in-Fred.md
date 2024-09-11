# Template Variables in Fred

Fred allows you to expose Template Variables (TVs) to the user. When used in an Element, Fred will update the display when the variable changes. This allows you to create dynamic content that can be updated by the user.

## Creating Template Variables

You start by creating a TV the same way you would normally in MODX. You need to assign the TV to one or more of the Templates assigned in your Fred Theme.

### Configure Properties

To display a TV on the frontend, you will need to configure the variables properties. This works similar to Fred Options. You will go to the Properties tab on the TV and unlock the default properties.

![tv_properties.png](tv_properties.png)

At minimum, you will need to add the `fred` property. This will be the type "Yes/No" and the default value should be set to `Yes`.

TVs can have all the types that Fred Options have. You can find more information on the different types in the [Fred Options documentation](settings.md#available-settings-types).

To set a type just add the property `fred.type` with the value of the type you want to use. For example, to set a TV to an image input you would add the property `fred.type` with the value of `image`. 

To set type-specific properties, you would add them with the prefix `fred.`. For example, to set the image TV to use a specific Media Source you would add the property `fred.mediaSource` with the value of the Media Source name.

## Using Template Variables in Elements

Once you have created a TV and assigned it to a Template, you can use it in an Element. You can reference the TV in the Element's settings by using the TV name as a Twig variable prefixed by `tv_`. For example, if you have a TV named `myTV`, you would reference it in the Element settings as `{{ tv_myTV }}`.

When you drag the Element onto a page, Fred will replace the Twig variable with the value of the TV. If the TV is an image, Fred will render the image. If the TV is a text input, Fred will render the text.

Additionally, you can use `data-fred-target` to allow the TV to be editable within an element. For example, in the case of the above image TV, you could have an element like:

```Twig
<img 
    src="{{ tv_myTV }}" 
    data-fred-target="tv_myTV" 
    data-fred-name="my-tv" 
    data-fred-media-source="Assets" 
    alt="{{ pagetitle }} Logo"
/>
```
