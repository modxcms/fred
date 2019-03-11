# Setting up a Theme to work with Gitify

Start by clicking the green `New` button when signed into Github. Give your new repository a name and description. This will be the source “origin” for collaborators. You should not initialize the repository with a README file because one will be added by the Theme later.

Note the URL for this project, by clicking the down-arrow on the green `Clone or download` button and choose the SSH URL, like `git@github.com:your_name/example_theme.git`.

## Connect to your Theme MODX project

SSH into your Cloud, and switch to the `www/` webroot directory. Then initialize git with the following command, using the SSH URL from above:

```
git init
git remote add origin git@github.com:your_name/example_theme.git
```

## Git Ignore

Create a `.gitingnore` file to exclude MODX and other files that are not needed with the following content. Make sure to change `!/assets/themes/{{your-theme-name}}` to its actual name like `!/assets/themes/lightcoral`:

```
# MODX & Gitify #
#################
/_backup
/config.core.php
/connectors
/core
/ht.access
/index.php
/manager
/assets/*
!/assets/themes/{{your-theme-name}}

# IDE files (optional or add more #
###################################
.idea
.vscode
.settings
nbproject
.project

# OS generated files (optional) #
#################################
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
node_modules
npm-debug.log
.sass-cache
```

## The Gitify YAML configruation

Create a yaml file named `.gitify` file in the webroot directory with following content:

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

This will instruct Gitify to include all Elements and categories, their Option Sets, public Blueprints and categories, RTE configs, and the Themes. Media sources are not currently supported for Theme exports and are therefore omitted.

## Intial Commit

Now it’s time to push the code to the source repo. Once you’ve reached a point where you are ready to share and collaborate on a theme, execute the following:

```
cd ~/www
gitify extract
git add --all  # or git add on files you want to commit
git commit -m "Initalize My Awesome Theme"  # please write your own message
git push origin master
```

Now you are ready to start [working with others](gitify_in_action.md).