# MODX Events

## FredBeforeRender

This event is triggered only on the frontend before Fred is initiated and is used to inject custom plugins to Fred or to load custom JS/CSS files.
No parameters are passed to this event, but it expects the output (assigned to `$modx->event->_output`) to be in this format:

```php
$modx->event->_output = [
    'includes' => $includes,
    'beforeRender' => $beforeRender,
    'lexicons' => $lexicons,
    'modifyPermissions' => $modifyPermissions
];
```

### includes

String of HTML markup that will get appended after Fred's CSS & JS file includes.

#### Example

```php
$includes = '
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.2/tinymce.min.js"></script>
';
```

### beforeRender

String of JS commands that will get added to Fred's `beforeRender` function. Could be used to register Fred plugins.

#### Example

```php
$beforeRender = '
    this.registerRTE("TinyMCE", FredRTETinyMCE);
';
```

### lexicons

An array of additional lexicons that Fred should load.

#### Example

```php
$lexicons = ['fredrtetinymce:default'];
```

### modifyPermissions

String of JS commands that will get added to Fred's `modifyPermissions` function where `permissions` parameter is available as an object of all available permissions for the current user.

#### Example

```php
$modifyPermissions = '
    permissions.save_document = false; // Disable save for the user
    permissions.my_plugin_show = true; // Custom permission
';
```

## FredOnBeforeFredResourceSave

This event is triggered before Fred Resource is saved either from manager or from web.
Properties:

- id (ID of the Resource that's going to be saved)
- resource (modResource object)

## FredOnFredResourceSave

This event is triggered after the Fred Resource is saved either from manager or from web.
Properties:

- id (ID of the Resource that's going to be saved)
- resource (modResource object)

## FredOnFredResourceLoad

This event is triggered before the frontend LoadContent endpoint returns data to the browser.
Properties:

- id (ID of the currently loading Resource)
- resource (modResource object)
- data (Data that will be returned by the endpoint in a form of stdClass)

## FredElementFormRender

@todo
