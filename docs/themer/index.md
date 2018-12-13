# Creating a Theme for Fred

Fred themers should have a basic understand of MODX, be proficient with HTML/CSS markup for creating Elements, and be able to create valid JSON for Option Sets. 

Intermediate Fred themers will use [Twig](https://twig.symfony.com/doc/2.x/) to create conditional logic in Elements. This can be used to show or hide things based on the settings  of the controls in Option Sets.

Advanced Fred themers will need to know Javascript to advanced elements with [JS Events](/themer/elements/js_events).

## Suggested Workflow

The easiest way to familiarize yourself with developing for Fred is to install a Theme, duplicate it, then edit and add to the copy to see how things work.

We strongly suggest installing the [Ace Extra](https://modx.com/extras/package/ace) as it gives you a nice code editor interface including warning of invalid JSON and code hints when creating Elements in the Manager.

## Code Hinting in Fred

As mentioned above, Fred will offer attribute-completion and code hints when working in the Manager:

Download and install [Fred Ace Integration](https://modx.com/extras/package/fredaceintegration) from extras. When creating/editing an element, start typing `data-` or `fred` and hit `ctrl+space` to show list of all fred attributes.

![Ace Integration](/images/ace_integration_dialog.png)