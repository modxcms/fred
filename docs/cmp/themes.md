# About Fred Themes

While most users will typically only have a single theme, you can have many installed in a site. Themes include all the things needed to create a site _except_ example resources/content (caveat, see Blueprints below). 

Being able to have multiple Themes allows Theme Builders to create and release a variety themes that share common settings (Option sets) across Elements.

## What makes up a Theme
Themes are made of of multple things:

- [Elements](#elements)
- [Option Sets](#option-sets)
- [Blueprints](#blueprints)
- [MODX Templates and any TVs assigned to them](#templates-and-tvs)
- [Dependencies](#dependencies)
- [Assets](#assets)
- [License, Changelog and Readme files](#license-changelog-and-readme-files)

When you create a Theme, Fred will autoamatically create a directory named for the theme in `assets/themes/{{theme-name}}`. Use this to store all your theme-specific assets like images, css, fonts and javascript. 

### Elements

Elements are the various design patterns used in a theme. Elements typically include HTML markup and can be configured by using Settings for the Element accessed via the gear icon. Elements can also include logic by using Twig in the markup to do things like show or hide certain things depending on the conditions you set.

### Option Sets

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

### Blueprints

Blueprints are pre-designed blocks or full pages of content including text and/or assets and one or more Elements. These are great starting points for structured content like landing pages, product pages, etc.

You can also use Blueprints for demo pages that users of your theme can use to get started more quickly. This allows you to include fully complete layouts made up of any combination of content and Elements you wish without worrying about Resource ID conflicts when installing a theme into an existing site.

### Templates and TVs

A Theme Builder can choose one or more MODX Templates to include in a Theme. Any TVs assigned to those themes will also be included.

### Dependencies

MODX Package Dependencies are any any Snippets or Plugins that are needed for this theme to work. `Fred` itself will always be a dependency and is included by default.

### Assets

Theme-specific assets like CSS/SASS/SCSS, images, JS and other similar files are packed into each theme in the `assets/theme/{{your-theme-name}}` directory.

### License, Changelog and Readme Files

These files show when you are installing the Extra from the MODX Package Manager.

## Build

The Fred 3PC allows you share your themes with colleagues or to submit it to the [MODX Extras](https://modx.com/extras/) repository:

1. Click on the "Themes" tab.
2. Find the Theme you'd like to share/publish.
3. Right-click on its name and choose the Build theme option.
4. Fill in the details and choose one of the two export options at the bottom. A copy of the theme will be saved to your `core/packages/{{theme-name}}` directory.
