# Theme Settings, Extract Templates and Resolvers

Theme settings and custom resolvers allow you to create more portable and flexible themes that are easier to work with without requiring manual configuration steps. 

## Theme Settings

Fred will automatically include all system settings under the theme’s namespace when building a theme. These settings should be prefixed with `fred.theme.theme-name`, where `theme-name` is the actual theme name. An example key for a background color in the One Pager demo theme might look like `fred.theme.one-pager.bg-color`.

Every theme includes a `fred.theme.theme-name.theme_dir` system setting which is created by default. This is for the theme’s web accessible assets such as images and css.

Only the system settings for the specific theme being built are included. Make sure they have the correct prefix and are under the correct namespace, otherwise they will be ignored.

## Extract Template

Extract Templates allow you to include specific settings or configuration for Extras used in Themes. They are added in following format:

```json
{
  "packages": [],
  "vehicles": []
}
```

The `packages` is an array of one or more third-party packages to include. The [`$modx->getService`](https://github.com/modxcms/xpdo/blob/2.x/xpdo/xpdo.class.php#L1224) method is called with the following details:

- `name`: The name of the package, typically all lowercase
- `class`: The name of the service class, often camel case
- `componentName`: Optional, defaults to the required `name` – the name of the directory inside `components/`
- `modelName`: Optional, defaults to  the required `name` – the name of the directory inside `model/`
- `settingPrefix`: Optional, defaults to  the required `name` – the prefix for a system setting (if a custom core path is used)

The `vehicles` is a correpsonding array of vehicles that will be exported in the vehicle object format:

- `object`: A wrapper containing the following attributes:
    + `class`: The name of the xPDO class
    + `graph`: The xPDO graph
    + `criteria`: Optional, defaults to `[]` – the xPDO criteria used to filter the objects to be extracted
    + `graphCriteria`: Optional, defaults to `null` – the xPDO graph criteria 
- `attributes`: The xPDOTransport attributes

### Example for MODX Minify
```json
{
  "packages": [
    {
      "name": "modxminify",
      "class": "modxMinify"
    }
  ],
  "vehicles": [
    {
      "object": {
        "class": "modxMinifyGroup",
        "graph": {
          "File": []
        }
      },
      "attributes": {
        "preserve_keys": false,
        "update_object": true,
        "unique_key": "name",
        "related_objects": true,
        "related_object_attributes": {
          "File": {
            "preserve_keys": false,
            "update_object": true,
            "unique_key": "filename"
          }
        }
      }
    }
  ]
}
```

### Example for Client Config
```json
{
  "packages": [
    {
      "name": "clientconfig",
      "class": "ClientConfig"
    }
  ],
  "vehicles": [
    {
      "object": {
        "class": "cgGroup",
        "graph": {
          "Settings": []
        }
      },
      "attributes": {
        "preserve_keys": false,
        "update_object": true,
        "unique_key": "label",
        "related_objects": true,
        "related_object_attributes": {
          "Settings": {
            "preserve_keys": false,
            "update_object": true,
            "unique_key": [
              "key",
              "group"
            ]
          }
        }
      }
    }
  ]
}
```

## Resolvers

Used by advanced developers, custom PHP resolvers can be executed after a theme is installed as the final step in the install process (or first when uninstalling). An instance of `modX` is accessible via `$transport->xpdo`. Resolvers can run when a package is installed, upgraded, or uninstalled using the Packager Installer in the MODX Manager.