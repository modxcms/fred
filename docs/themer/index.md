# Creating a Theme for Fred

Fred themers should have a basic understand of MODX, be proficient with HTML/CSS markup for creating Elements, and be able to create valid JSON for Option Sets.

Intermediate Fred themers will use [Twig](https://twig.symfony.com/doc/2.x/) to create conditional logic in Elements. This can be used to show or hide things based on the settings  of the controls in Option Sets.

Advanced Fred themers will need to know Javascript to advanced elements with [JS Events](elements/js_events.md).

## Suggested Workflow

The easiest way to familiarize yourself with developing for Fred is to install a Theme, duplicate it, then edit and add to the copy to see how things work. Adding new Options Set controls and exploring using Twig logic for conditional output are likewise great exercises to learn how to create flexible and powerful Themes.

We strongly suggest installing the [Ace Extra](https://modx.com/extras/package/ace) as it gives you a nice code editor interface including warning of invalid JSON and code hints when creating Elements in the Manager.

## Code Hinting in Fred

If you have Ace installed as suggested above, attribute-completion and code hints are available when working in the Manager for Fred by installing the [Fred Ace Integration](https://modx.com/extras/package/fredaceintegration) Extra. When creating or editing an Element, start typing `data-` or `fred` and the press `ctrl+space` to show list of all available Fred attributes.

![Ace Integration](/media/ace_integration_dialog.png)
