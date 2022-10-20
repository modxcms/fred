<?php

use MODX\Revolution\modAccessContext;
use MODX\Revolution\modAccessPermission;
use MODX\Revolution\modAccessPolicy;
use MODX\Revolution\modAccessPolicyTemplate;
use MODX\Revolution\modAccessPolicyTemplateGroup;
use MODX\Revolution\modContext;
use MODX\Revolution\modUserGroup;
use MODX\Revolution\modX;
use xPDO\Transport\xPDOTransport;

/**
 * @var xPDOTransport $transport
 * @var array $object
 * @var array $options
 */


/** @var modX $modx */
$modx =& $transport->xpdo;

switch ($options[xPDOTransport::PACKAGE_ACTION]) {
    case xPDOTransport::ACTION_INSTALL:
    case xPDOTransport::ACTION_UPGRADE:

        $group = $modx->getObject(modAccessPolicyTemplateGroup::class, ['name' => 'Administrator']);
        if (!$group) return;

        /** @var modAccessPolicyTemplate $template */
        $template = $modx->getObject(modAccessPolicyTemplate::class, ['name' => 'Fred', 'template_group' => $group->get('id')]);
        if (!$template) {
            $template = $modx->newObject(modAccessPolicyTemplate::class);
            $template->set('name', 'Fred');
            $template->set('template_group', $group->get('id'));
            $template->set('description', 'A policy template to for Fred');
            $template->set('lexicon', 'fred:permissions');
            $template->save();
        }

        $permissions = [
            'fred',
            'fred_elements',
            'fred_element_save',
            'fred_element_screenshot',
            'fred_element_rte_config_save',
            'fred_element_rte_config_delete',
            'fred_element_rtes',
            'fred_element_rebuild',
            'fred_element_option_sets_save',
            'fred_element_option_sets_delete',
            'fred_element_option_sets',
            'fred_element_move',
            'fred_element_category_delete',
            'fred_element_category_save',
            'fred_element_delete',
            'fred_element_front_end_delete',
            'fred_element_categories',
            'fred_element_cache_refresh',
            'fred_themes_save',
            'fred_themes_delete',
            'fred_themes_build',
            'fred_themes',
            'fred_themed_templates_save',
            'fred_themed_templates_delete',
            'fred_themed_templates',
            'fred_settings_tvs',
            'fred_settings_tags',
            'fred_settings_advanced',
            'fred_media_sources',
            'fred_settings',
            'fred_blueprint_categories_save',
            'fred_blueprint_categories_delete',
            'fred_blueprint_categories_create_public',
            'fred_blueprints_save',
            'fred_blueprint_categories',
            'fred_blueprints_delete',
            'fred_blueprints_create_public',
            'fred_blueprints',
            'new_document_in_root',
            'view_unpublished',
            'resource_duplicate',
            'unpublish_document',
            'publish_document',
            'save_document',
            'undelete_document',
            'new_document',
            'delete_document',
        ];

        foreach ($permissions as $permission) {
            /** @var modAccessPermission $obj */
            $obj = $modx->getObject(modAccessPermission::class, [
                'template' => $template->get('id'),
                'name' => $permission
            ]);

            if (!$obj) {
                $obj = $modx->newObject(modAccessPermission::class);
                $obj->set('template', $template->get('id'));
                $obj->set('name', $permission);
            }

            $obj->set('description', "fred.permissions.{$permission}");
            $obj->save();
        }

        /** @var modAccessPolicy $adminPolicy */
        $adminPolicy = $modx->getObject(modAccessPolicy::class, ['name' => 'Fred Admin']);
        if (!$adminPolicy) {
            $adminPolicy = $modx->newObject(modAccessPolicy::class);
            $adminPolicy->set('name', 'Fred Admin');
            $adminPolicy->set('description', 'Administrator policy for Fred.');
            $adminPolicy->set('template', $template->get('id'));
            $adminPolicy->set('lexicon', $template->get('lexicon'));
        }

        $data = [];

        foreach ($permissions as $permission) {
            $data[$permission] = true;
        }

        $adminPolicy->set('data', $data);
        $adminPolicy->save();


        /** @var modUserGroup $adminUserGroup */
        $adminUserGroup = $modx->getObject(modUserGroup::class, ['id' => 1]);
        if ($adminUserGroup) {
            /** @var modContext[] $contexts */
            $contexts = $modx->getIterator(modContext::class);
            foreach ($contexts as $context) {
                $contextAccess = $modx->getObject(modAccessContext::Class, ['target' => $context->get('key'), 'principal_class' => modUserGroup::class, 'principal' => 1, 'policy' => $adminPolicy->get('id')]);
                if (!$contextAccess) {
                    $contextAccess = $modx->newObject(modAccessContext::class);
                    $contextAccess->set('target', $context->get('key'));
                    $contextAccess->set('principal_class', modUserGroup::class);
                    $contextAccess->set('principal', 1);
                    $contextAccess->set('policy', $adminPolicy->get('id'));
                    $contextAccess->set('authority', 0);
                    $contextAccess->save();
                }
            }
        }

        /** @var modAccessPolicy $editorPolicy */
        $editorPolicy = $modx->getObject(modAccessPolicy::class, ['name' => 'Fred Editor']);
        if (!$editorPolicy) {
            $editorPolicy = $modx->newObject(modAccessPolicy::class);
            $editorPolicy->set('name', 'Fred Editor');
            $editorPolicy->set('description', 'Editor policy for Fred.');
            $editorPolicy->set('template', $template->get('id'));
            $editorPolicy->set('lexicon', $template->get('lexicon'));
        }

        $data = [
            'delete_document' => true,
            'fred' => true,
            'fred_blueprint_categories' => true,
            'fred_blueprint_categories_create_public' => true,
            'fred_blueprint_categories_save' => true,
            'fred_blueprints' => true,
            'fred_blueprints_create_public' => true,
            'fred_blueprints_save' => true,
            'fred_element_categories' => true,
            'fred_element_category_save' => true,
            'fred_element_move' => true,
            'fred_element_save' => true,
            'fred_element_front_end_delete' => true,
            'fred_elements' => true,
            'fred_settings' => true,
            'fred_settings_advanced' => true,
            'fred_settings_tags' => true,
            'fred_settings_tvs' => true,
            'fred_themed_templates' => true,
            'new_document' => true,
            'resource_duplicate' => true,
            'save_document' => true,
            'view_unpublished' => true,
            'fred_element_cache_refresh' => true
        ];

        $editorPolicy->set('data', $data);
        $editorPolicy->save();


        break;
}

return true;
