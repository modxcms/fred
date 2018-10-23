<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

require_once dirname(dirname(__FILE__)) . '/index.class.php';

/**
 * @package fred
 * @subpackage controllers
 */
class FredACLsManagerController extends FredBaseManagerController
{
    public function process(array $scriptProperties = array())
    {
        $modx = $this->modx;
        
        $group = $modx->getObject('modAccessPolicyTemplateGroup', ['name' => 'Admin']);
        if (!$group) return;

        /** @var modAccessPolicyTemplate $template */
        $template = $modx->getObject('modAccessPolicyTemplate', ['name' => 'Fred', 'template_group' => $group->get('id')]);
        if (!$template) {
            $template = $modx->newObject('modAccessPolicyTemplate');
        }

        $template->set('name', 'Fred');
        $template->set('template_group', $group->get('id'));
        $template->set('description', 'A policy template to for Fred');
        $template->set('lexicon', 'fred:permissions');
        $template->save();

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
            'fred_element_categories',
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
            $obj = $modx->getObject('modAccessPermission', ['template' => $template->get('id'), 'name' => $permission]);
            
            if (!$obj) {
                $obj = $modx->newObject('modAccessPermission');
            }
            
            $obj->set('template', $template->get('id'));
            $obj->set('name', $permission);
            $obj->set('description', "fred.permissions.{$permission}");
            $obj->save();
        }

        /** @var modAccessPolicy $adminPolicy */
        $adminPolicy = $modx->getObject('modAccessPolicy', ['name' => 'Fred Admin']);
        if (!$adminPolicy) {
            $adminPolicy = $modx->newObject('modAccessPolicy');
            $adminPolicy->set('name', 'Fred Admin');
            $adminPolicy->set('description', 'Administrator policy for Fred.');
            $adminPolicy->set('template', $template->get('id'));
            $adminPolicy->set('lexicon', $template->get('lexicon'));

            $data = [];

            foreach ($permissions as $permission) {
                $data[$permission] = true;
            }

            $adminPolicy->set('data', $data);
            $adminPolicy->save();
        }

        /** @var modUserGroup $adminUserGroup */
        $adminUserGroup = $modx->getObject('modUserGroup', ['id' => 1]);
        if ($adminUserGroup) {
            /** @var modContext[] $contexts */
            $contexts = $modx->getIterator('modContext');
            foreach ($contexts as $context) {
                $contextAccess = $modx->getObject('modAccessContext', [
                    'target' => $context->get('key'),
                    'policy' => $adminPolicy->get('id'),
                    'principal_class' => 'modUserGroup',
                ]);

                if (!$contextAccess) {
                    $contextAccess = $modx->newObject('modAccessContext');
                }

                $contextAccess->set('target', $context->get('key'));
                $contextAccess->set('principal_class', 'modUserGroup');
                $contextAccess->set('principal', 1);
                $contextAccess->set('policy', $adminPolicy->get('id'));
                $contextAccess->set('authority', 0);
                $contextAccess->save();
            }
        }
    }

    public function getPageTitle()
    {
        return $this->modx->lexicon('fred.menu.fred');
    }

    public function checkPermissions()
    {
        return true;
    }


}