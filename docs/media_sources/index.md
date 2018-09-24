Media Sources can either be assigned globally via a setting in the Media Source itself, or in an Element's settings by referencing the Media Source ID(s). On install two new settings are added to each Media Source. If you'll want to access Media Sources from Fred, you will need to manually add these settings.

## Media Source Settings

### fred
A Yes/No setting that defines if the Media Source is globally available to Elements rendered in Fred. _(defaults to no)_
### fredReadOnly
A Yes/No setting that locks a Media Source from being written to. _(defaults to no)_

## Element Settings
### mediaSource
ID of the Media Source to use for Finder. Multiple IDs can be passed separated by comma `,`.

### imageMediaSource
ID of the Media Source to use for Image fields. Multiple IDs can be passed separated by comma `,`. This option overrides `mediaSource`.