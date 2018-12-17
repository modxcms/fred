# Setting up a Theme to work with Gitify

Create `.gitify` file in the root, with following content:

```yaml
data_directory: _data/
backup_directory: _backup/
data:
    fred_themes:
        class: FredTheme
        primary: id
        exclude_keys: ['config']
        package: fred
    fred_element_categories:
        class: FredElementCategory
        primary: id
    fred_element_option_sets:
        class: FredElementOptionSet
        primary: id
        extension: .json
    fred_element_rte_configs:
        class: FredElementRTEConfig
        primary: id
        extension: .json
    fred_elements:
        class: FredElement
        primary: id
        extension: .html
    fred_blueprint_categories:
        class: FredBlueprintCategory
        primary: id
    fred_blueprints:
        class: FredBlueprint
        primary: id
        extension: .json
```