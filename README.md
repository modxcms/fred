# Fred

Full documentation for Fred: https://modxcms.github.io/fred/

Fred is a visual drag-and-drop **fr**ont-end **ed**itor for [MODX CMS](https://modx.com). It empowers ordinary people to create exceptional content without knowing how to code or needing to learn complex interfaces. 

To create content with Fred you merely drag Elements from a sidebar and drop them where you wish content to appear. Select the copy you wish to change or click an image you want to update, edit directly in your browser, and click a green checkmark to save. 

Fred uses familiar visual controls like sliders, toggles and color pickers. Further, these controls can pass specific parameters developers want end users to adjust to backend code or an API. This results in a bulletproof and powerful content creation solution. 

In short, Fred makes constructing beautiful and complex pages simple for even the most non-technical of users.

## What does Fred do for developers and site builders?

Fred offers theme builders a great entrance into the MODX ecosystem. It is easy to port existing themes to Fred and export them for submission to the [MODX Extras](https://modx.com/extras/). 

For existing MODX developers, Fred brings an option to create more flexible and intuitive editing experiences for site owners. Fred can power designs that would otherwise require dozens of TVs, a complex Manager UI, or tricky Manager customization. 

The changelog for the current version of Fred is located at https://github.com/modxcms/fred/blob/master/core/components/fred/docs/changelog.txt.

## How is Fred different from other visual content builders?

Fred adheres to MODX’s core tenet of Creative Freedom. It doesn’t force you into someone else’s preferred front-end framework or way of building things. If you can imagine or prototype it, Fred can power it—without compromise. 

Developers and designers can realize pixel-perfect websites and confidently turn over content creation duties without fear of things breaking. 
 
So whether a site is made by customizing a free starter theme, or handcrafted 100% from scratch, Fred can help everyone build websites faster, more consistently and with better results. 

## What Else Can Fred Do?

The following is a sample of Fred’s capabilities that make it a compelling visual content building platform:

- Transform static Design Libraries into a live content creating tool that strictly adheres to brand standards, and that is easily understood and used by non-technical team members across your entire organization
- Use optional conditional/looping Twig template logic to create robust Elements limited only by your imagination
- Create and organize collections of Elements as building blocks for pages
- Blueprints provide boilerplate full- or partial-page templates
- Multiple dropzones for complete control of every page layout
- Configure content using a variety of controls including toggles, text inputs, date pickers, select inputs, sliders, Resource pickers, and color pickers
- Supports MODX code Snippets with live Ajax rendering of changes
- Visual Font Awesome 5 icon picker—developers can create other icon pickers, too 
- Simple content formatting with a curated default TinyMCE rich text editor
- Rearrange and re-order page content via drag-and-drop
- Quickly duplicate existing Elements to build up galleries and sliders
- Fred content renders down to cachable output for blazing-fast page speed
- Complete set of production-ready Bootstrap 4 Elements to slash the time needed for theme builders to get startedThe friendly front-end editor … documentation at https://modxcms.github.io/fred/

## Upgrade Notes
If you are upgrading from a previous release to the following versions, please note the important changes:

### -> rc1
Make sure all Themes are named uniquely, and any Elements, Blueprints, Element categories, or Blueprint categories within Themes likewise have unique names. You can have duplicate category and Element names across different Themes.

### -> beta7
If you defined Media Sources in Option Sets, in Element markup, or Options Override, you need to adjust these from using the Media Source ID to the Media Source name.


## Folder structure
Fred installs the following into your MODX webroot directory:

- `_build/assets/js` - source code for the front-end
- `_build/assets/sass` - source code for front-end styles
- `assets/components/fred/mgr` - Backend Manager page (“3PC”)
- `assets/components/fred/web` - Assets used in the front-end
- `assets/components/fred/web/endpoints` - XHR endpoints for asyncronous calls
- `core/components/fred/model/fred/src` - Autoloaded directory for the Fred namespace
- `core/components/fred/model/fred/src/Endpoint` - Implementation for the XHR endpoints

## Prerequisites for developing for Fred
- MODX Revolution
- GPM
- Composer
- Yarn
- Ruby Sass

### Developing Fred
First, set up the project inside your MODX webroot: 

1. `yarn install` from web root
2. change directories to `core/components/fred/model`
3. `composer install`
4. install fred with GPM

### Build
Set up watchers to update the code for changes:

1. Start watchers from webroot: `yarn dev`
2. Minify CSS and JS and prepare code for production: `yarn build` 
