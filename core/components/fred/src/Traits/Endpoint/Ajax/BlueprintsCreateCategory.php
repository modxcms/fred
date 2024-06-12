<?php

namespace Fred\Traits\Endpoint\Ajax;

use Fred\Utils;

trait BlueprintsCreateCategory
{
    public function process()
    {
        if (!$this->modx->hasPermission('fred_blueprint_categories_save')) {
            return $this->failure($this->modx->lexicon('fred.fe.err.permission_denied'));
        }

        if (empty($this->body['name'])) {
            return $this->failure($this->modx->lexicon('fred.fe.err.blueprint_categories_ns_name'), ['name' => $this->modx->lexicon('fred.fe.err.blueprint_categories_ns_name')]);
        }

        $theme = isset($this->body['theme']) ? intval($this->body['theme']) : 0;

        if (empty($theme)) {
            return $this->failure($this->modx->lexicon('fred.fe.err.blueprint_categories_ns_theme'), ['theme' => $this->modx->lexicon('fred.fe.err.blueprint_categories_ns_theme')]);
        }

        if ($this->modx->getCount($this->blueprintCategoryClass, ['name' => $this->body['name'], 'theme' => $theme]) > 0) {
            return $this->failure($this->modx->lexicon('fred.fe.err.blueprint_categories_ae_name'), ['name' => $this->modx->lexicon('fred.fe.err.blueprint_categories_ae_name')]);
        }

        $rank = isset($this->body['rank']) ? intval($this->body['rank']) : 0;
        $public = isset($this->body['public']) ? intval($this->body['public']) : 0;

        if (!$this->modx->hasPermission('fred_blueprint_categories_create_public')) {
            $public = 0;
        }

        if (empty($rank)) {
            $c = $this->modx->newQuery($this->blueprintCategoryClass);
            $c->sortby('rank', 'desc');
            $c->limit(1);

            $lastRecord = $this->modx->getIterator($this->blueprintCategoryClass, $c);
            $rank = 1;

            foreach ($lastRecord as $lastItem) {
                $rank = $lastItem->rank + 1;
                break;
            }
        }

        $category = $this->modx->newObject($this->blueprintCategoryClass);
        $category->set('name', $this->body['name']);
        $category->set('theme', $theme);
        $category->set('rank', $rank);
        $category->set('public', $public);
        $category->set('createdBy', $this->modx->user->id);
        $saved = $category->save();

        if ($saved === true) {
            $templates = !empty($this->body['templates']) ? $this->body['templates'] : '';
            $templates = Utils::explodeAndClean($templates, ',', 'intval');

            foreach ($templates as $template) {
                $categoryAccess = $this->modx->newObject($this->blueprintCategoryTemplateAccessClass);
                $categoryAccess->set('category', $category->get('id'));
                $categoryAccess->set('template', $template);
                $categoryAccess->save();
            }
        }

        return $this->success();
    }
}
