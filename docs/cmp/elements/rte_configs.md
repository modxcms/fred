Under RTE Configs tab you can manage all configuration sets for all installed RTEs.
 
![RTE Configs Grid](img/rte_configs_grid.png)

When creating new RTE config, you have to give it a unique name, which is used as a config identifier in [data-fred-rte-config](/elements/attributes/#data-fred-rte-config) attribute.

Please make sure that the config is a valid JSON, you can use [JSON Lint](https://jsonlint.com/) in case you don't have [ACE editor](https://modx.com/extras/package/ace) installed.

### Default configs
If you create a config with a same name as your RTE, for example `TinyMCE`, this config will be used as a default one (instead of the one TinyMCE is shipped with) when you don't specify [data-fred-rte-config](/elements/attributes/#data-fred-rte-config) attribute.