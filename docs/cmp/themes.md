While most users will typically only have a single theme, you can have many installed in a site. Themes include all the things needed to create a site _except_ example resources/content (caveat, see Blueprints below). 

Being able to have multiple Themes allows Theme Builders to create and release a variety themes that share common settings (Option sets) across Elements.

Themes are made of of multple things:

- [Elements](#elements)
- [Option Sets](#option-sets)
- [Blueprints](#blueprints)
- [MODX Templates and any TVs assigned to them](#templates-and-tvs)
- [Dependencies](#dependencies)
- [Assets](#assets)
- [License, Changelog and Readme files](#license-changelog-and-readme-files)

## Elements

Elements are the various design patterns used in a theme. Elements typically include HTML markup and can be configured by using Settings for the Element accessed via the gear icon. Elements can also include logic by using Twig in the markup to do things like show or hide certain things depending on the conditions you set.

## Option Sets

Option Sets are controls that allow you to configure an Element. The following inputs are available in Option Sets:

- text
- textarea
- select list
- toggle
- slider
- image picker with preview
- file picker
- simple color picker
- advanced color picker
- MODX Resource chooser

## Blueprints

Blueprints are pre-composed blocks or full pages of content including text and/or assets and one or more Elements.

Instead of including example Resources, use Blueprints for demo pages. This allows you to include fully complete layouts made up of any combination of content and Elements you wish.

## Templates and TVs

A Theme Builder can choose one or more MODX Templates to include in a Theme. Any TVs assigned to those themes will also be included.

## Dependencies

These are MODX Package Dependencies—any Snippets or Plugins usually installed via the MODX Installer that are needed for this theme to work. `Fred` itself will always be a dependency.

## Assets

Theme-specific assets like CSS/SASS/SCSS, images, JS and other similar files are packed into each theme in the `assets/theme/{{your-theme-name}}` directory.

## License, Changelog and Readme Files

These files show when you are installing the Extra from the MODX Package Manager.
