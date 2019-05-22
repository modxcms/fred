# Theme
@TODO: Fix this document, move it to correct location

## Theme Settings
When building a theme, System Setting under Theme's namespace (which is automatically created when creating a theme and has a name in form `fred.theme.themename`) and with a key starting `fred.theme.themename.` (example key: `fred.theme.one-pager.bg-color`) will be automatically included.

Please make sure the system setting has a correct prefix and is under the correct namespace, otherwise it will be ignored.

## Resolvers
A custom PHP resolvers can be attached to a theme and will execute as a final step in the install process (first in the uninstall process). Instance of modX can be accessed via `$transport->xpdo`.
