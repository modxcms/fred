# Permissions
The following sections list the permissions available for Fred. The subhead is the permission key used in code, followed by a brief description of where and what those permissions control Most of these permissions can be used both with the `mgr` context and front-end contexts like `web`. However there are few that only apply to `mgr` or front-end contexts. 

For example, if you apply the `fred` permission to the `mgr` Context, users will see the Fred Extra in the Manager. If you apply it to a front-end context, the Fred controls will apear when browsing the site from the front-end (if assigned to a page’s Template). Applying the `fred_settings` permission to `mgr` context will do nothing as this permission is only used in front-end to be able to see the Settings tab in the sidebar menu.   

## General Permissions
#### fred
View Fred in the Manager or front-end Contexts

#### fred_settings
View the Settings menu in the front-end sidebar

#### fred_settings_advanced
View the Advanced Settings under the Settings menu

#### fred_settings_tvs
View the TVs section under the Settings menu

#### fred_settings_tags
View the Tags section under the Settings menu

#### fred_media_sources
View Media Sources in the Manager

## Element Permissions
#### fred_elements
View Elements in the Manager or front-end Contexts

#### fred_element_save
Create/edit/duplicate Elements in the Manager

#### fred_element_delete
Delete Elements in the Manager

#### fred_element_screenshot
Take a screenshot to replace the current sidebar preview for Elements

#### fred_element_move
Drag and drop Elements into drop zones in the front-end

#### fred_element_rebuild
View the Rebuild tab in the Manager

### Element Category Permissions
#### fred_element_categories
View Fred Element Categories in the Manager

#### fred_element_category_save
Create/edit/duplicate Element in the Manager or front-end Context 

#### fred_element_category_delete
Delete any Element Categories in the Manager

## RTE Config Permissions
#### fred_element_rtes
View RTE configs in the Manager

#### fred_element_rte_config_save
Create/edit/duplicate RTE configs in the Manager

#### fred_element_rte_config_delete
Delete RTE configs in the Manager

## Option Sets Permissions
#### fred_element_option_sets
View Option Sets in the Manager

#### fred_element_option_sets_save
Create/edit/duplicate Option Sets in the Manager

#### fred_element_option_sets_delete
Delete Option Sets in the Manager

## Blueprints Permissions
#### fred_blueprints
View Blueprints in the Manager or front-end Context

#### fred_blueprints_save
Create/edit/duplicate Blueprints in the front-end

#### fred_blueprints_delete
Delete Blueprints in the Manager

#### fred_blueprints_create_public
Create public Blueprints in the front-end

### Blueprint Category Permissions
#### fred_blueprint_categories
View Blueprint Categories in the Manager

#### fred_blueprint_categories_save
Create/edit/duplicate Blueprint Categories in the Manager or front-end Context

#### fred_blueprint_categories_delete
Delete Blueprint Categories in the Manager

#### fred_blueprint_categories_create_public
Create Public Blueprint Categories in the Manager or front-end Context

## Theme Permissions
#### fred_themes
View the Themes tab in the Manager

#### fred_themes_save
Create/edit/duplicate Themes in the Manager

#### fred_themes_delete
Delete Themes in the Manager

#### fred_themes_build
Build Themes in the Manager

### Themed Template Permissions
#### fred_themed_templates
View Theme/Template assignments in the Manager

#### fred_themed_templates_save
Assign/Update Fred Themes to MODX Templates in the Manager

#### fred_themed_templates_delete
Unassign Theme from MODX Templates in the Manager

## MODX Permissions
#### new_document
Create new Resources from the front-end

#### new_document_in_root
Create Resources in the top-level of web root

#### save_document
Save Resources from the front-end

#### view_unpublished
View unpublished Resources from the front-end

#### resource_duplicate
Duplicate Resources from the front-end

#### publish_document
Publish Resources from the front-end

#### unpublish_document
Unpublish Resources from the front-end

#### delete_document
Delete Resources from the front-end

#### undelete_document
Undelete Resources from the front-end
