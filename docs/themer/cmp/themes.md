# About Fred Themes

While most users will typically only have a single theme, you can have many installed in a site. Themes include all the things needed to create a site _except_ example pages (caveat: see Blueprints below). 

Being able to have multiple Themes allows Theme Builders to create and release a variety themes that share common options (Option sets) across Elements.

## What makes up a Theme
Themes are made of of multple things:

- [Elements](#elements)
- [Blueprints](#blueprints)
- [MODX Templates and any TVs assigned to them](#templates-and-tvs)
- [Categories](#categories)
- [Extras](#extras)
- [Assets](#assets)
- [License, Changelog and Readme files](#license-changelog-and-readme-files)

When you create a Theme, Fred will automatically create a directory named for the theme in `assets/themes/{{theme-name}}`. Use this to store all your theme-specific assets like images, css, fonts and javascript. 

**IMPORTANT NOTE:** As of 1.0, Fred currently does not support exporting Media Sources. If you have used them in your Theme, please include instructions on setting them up in your README file. 

### Default Element

The default element setting allows you to chose a default Fred Element and target area for placing the content on existing documents. The setting is formatted as `ID|target` where ID is the identification number of the Fred Element and the target is the HTML object within containing a `data-fred-name` attribute. This is useful for converting a standard resource to Fred, as it will place the existing content in the default element.

If you aren't finding the identification number of the Fred Element, right-click on the top of the element grid and make sure the ID column is selected.

### Elements

A Theme Builder will automatically include all Element Categories attached to the Theme with all their [Elements](/elements). All [Option Sets](/option_sets) and [RTE Configs](/rte_configs) attached to the Theme will be also included.

### Blueprints

A Theme Builder will automatically include **public** Blueprint Categories attached to the THeme with all their **public** [Blueprints](/blueprints). 

### Templates and TVs

A Theme Builder will include all MODX Templates assigned to the Theme. Any TVs assigned to those MODX Templates will also be included.

### Categories

A User can select any root MODX Category to be included with the Theme. The Theme Builder will then include all child categories, snippets, chunks and plugins assigned to the root or child category.

### Extras

Extras are MODX packages required for your theme to be fully functional. User will need to install all of the listed extras, before he can proceed with installing your Theme. `Fred` itself will always be a dependency and is included by default.

### Assets

Theme-specific assets like CSS/SASS/SCSS, images, JS and other similar files are packed into each theme in the `assets/theme/{{your-theme-name}}` directory.

### License, Changelog and Readme Files

These files show when you are installing the Extra from the MODX Package Manager.

## Build a Theme to Share

The Fred Manager Extra (aka, 3rd-party Component or 3PC) allows you share your themes with colleagues or to submit it to the [MODX Extras](https://modx.com/extras/) repository:

1. Click on the `Themes` tab.
2. Find the Theme you’d like to share/publish.
3. Right-click on its name and choose the `Build theme` option.
4. Fill in the details and choose one of the two export options at the bottom. 
 
A MODX Installer-ready theme will be saved to your `core/packages/` directory as `{{theme-name}}.transport.zip` file that you can distribute. You can also choose to build and download, which will also save a copy to your downloads directory on your local computer.
