#Options

Options are what defines the controls given to end users when configuring Elements. They are defined in a Option Sets that are attached to Elements.

## Option Sets

Option Sets allow you to create Element configuration settings and frequently used sub-sets for use with Elements.

### Complete Option Sets

Option Sets with the `complete` flag set to `Yes` can be assigned to individual [Element](../elements/index.md). Option Sets can also be assigned to more than one Element, making it easier to reuse common settings across Elements.

### Partial Option Sets

Option Sets with `No` in this flag are meant to be [imported](import.md) into other Option Sets. You can use these to define commonly used settings or specific options that will repeat across multiple Option Sets, for example, color swatches, margins and padding, or text style settings.


One option set can be used with multiple Elements. If you have frequently used sub-sections of option sets you’d like to share across many option sets, you can use partial option sets. These can then be imported into many other option sets, and are useful for things like color pallets, etc.

A variety of [option controls/settings](options.md) give you flexibility in how your end users create and update content. These controls can further be grouped into sub-groups that can be opened/closed for better organization of large option sets.

## Importing

If you use similar Option settings across many sets, you might want to organize them in to partial option sets, and [import](import.md) them to make managing Option Sets more straightforward.

## Option Overrides

On the Fred Manager page for the Create/Edit Element view you can define a unique non-reusable set of controls for the settings. [Overrides](override.md) only affect the current Element and will not affect other Elements using the same Option Set. 