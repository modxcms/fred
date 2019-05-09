# Permissions
The following sections list the permissions available for Fred. The subhead is the permission key used in code, followed by a brief description of where and what those permissions control Most of these permissions can be used both with the `mgr` context and front-end contexts like `web`. However there are few that only apply to `mgr` or front-end contexts. 

For example, if you apply the `fred` permission to the `mgr` Context, users will see the Fred Extra in the Manager. If you apply it to a front-end context, the Fred controls will apear when browsing the site from the front-end (if assigned to a page’s Template). Applying the `fred_settings` permission to `mgr` context will do nothing as this permission is only used in front-end to be able to see the Settings tab in the sidebar menu.   

## General Permissions
#### fred
View Fred (mgr) (web)

#### fred_settings
View the Settings menu in the sidebar (web)

#### fred_settings_advanced
View the Advanced Settings under the Settings menu (web)

#### fred_settings_tvs
View the TVs section under the Settings menu (web)

#### fred_settings_tags
View the Tags section under the Settings menu (web)

#### fred_media_sources
View Media Sources (mgr)

## Element Permissions
#### fred_elements
View Elements (mgr) (web)

#### fred_element_save
Create/edit/duplicate Elements (mgr)

#### fred_element_delete
Delete Elements (mgr)

#### fred_element_front_end_delete
Remove Elements from drop zone (web)

#### fred_element_screenshot
Take a screenshot to replace the current sidebar preview for Elements (web)

#### fred_element_move
Drag and drop Elements into drop zones (web)

#### fred_element_rebuild
View the Rebuild tab (mgr)

### Element Category Permissions
#### fred_element_categories
View Fred Element Categories (mgr)

#### fred_element_category_save
Create/edit/duplicate Element (mgr) 

#### fred_element_category_delete
Delete Element Categories (mgr)

#### fred_element_cache_refresh
Show refresh cache button in Element's toolbar (web)

## RTE Config Permissions
#### fred_element_rtes
View RTE configs (mgr)

#### fred_element_rte_config_save
Create/edit/duplicate RTE configs (mgr)

#### fred_element_rte_config_delete
Delete RTE configs (mgr)

## Option Sets Permissions
#### fred_element_option_sets
View Option Sets (mgr)

#### fred_element_option_sets_save
Create/edit/duplicate Option Sets (mgr)

#### fred_element_option_sets_delete
Delete Option Sets (mgr)

## Blueprints Permissions
#### fred_blueprints
View Blueprints (mgr) (web)

#### fred_blueprints_save
Create/edit/duplicate Blueprints (mgr) (web)

#### fred_blueprints_delete
Delete Blueprints (mgr)

#### fred_blueprints_create_public
Create public Blueprints (mgr) (web)

### Blueprint Category Permissions
#### fred_blueprint_categories
View Blueprint Categories (mgr)

#### fred_blueprint_categories_save
Create/edit/duplicate Blueprint Categories (mgr) (web)

#### fred_blueprint_categories_delete
Delete Blueprint Categories (mgr)

#### fred_blueprint_categories_create_public
Create Public Blueprint Categories (mgr) (web)

## Theme Permissions
#### fred_themes
View the Themes tab (mgr)

#### fred_themes_save
Create/edit/duplicate Themes (mgr)

#### fred_themes_delete
Delete Themes (mgr)

#### fred_themes_build
Build Themes (mgr)

### Themed Template Permissions
#### fred_themed_templates
View Theme/Template assignments (mgr)

#### fred_themed_templates_save
Assign/Update Fred Themes to MODX Templates (mgr)

#### fred_themed_templates_delete
Unassign Theme from MODX Templates (mgr)

## MODX Permissions
#### new_document
Create new Resources (mgr) (web)

#### new_document_in_root
Create Resources in the top-level of web root (mgr) (web)

#### save_document
Save Resources (mgr) (web)

#### view_unpublished
View unpublished Resources (web)

#### resource_duplicate
Duplicate Resources (mgr) (web)

#### publish_document
Publish Resources (mgr) (web)

#### unpublish_document
Unpublish Resources (mgr) (web)

#### delete_document
Delete Resources (mgr) (web)

#### undelete_document
Undelete Resources (mgr) (web)
