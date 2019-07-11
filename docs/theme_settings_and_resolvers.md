# Theme

@TODO: Fix this document, move it to correct location

## Theme Settings

When building a theme, System Setting under Theme's namespace (which is automatically created when creating a theme and has a name in form `fred.theme.themename`) and with a key starting `fred.theme.themename.` (example key: `fred.theme.one-pager.bg-color`) will be automatically included.

Please make sure the system setting has a correct prefix and is under the correct namespace, otherwise it will be ignored.

## Resolvers

A custom PHP resolvers can be attached to a theme and will execute as a final step in the install process (first in the uninstall process). Instance of modX can be accessed via `$transport->xpdo`.

## Extract Template

Extract template can be added in following format:
```json
{
  "packages": [],
  "vehicles": []
}
```

- packages: array of third party packages that should be loaded
  - package object format (`$modx->getService` method will be called with these details):
    - name: Name of the package
    - class: Name of the service class 
    - componentName: Name of the folder under components; Optional; Default to `name`
    - modelName: Name of the folder under model; Optional; Default to `name`
    - settingPrefix: Prefix for system setting (if custom core path is used); Optional; Default to `name` 
- vehicles: array of vehicles that will be exported
    - vehicle object format:
        - object
          - class: Name od the xPDO class
          - graph: xPDO graph
          - criteria: xPDO criteria to filter objects to extract; Optional; Default to `[]`
          - graphCriteria: xPDO graph criteria; Optional; Default to `null`
        - attributes: xPDOTransport attributes

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
