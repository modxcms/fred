<?php

namespace Fred\Traits\Endpoint\Ajax;

use Fred\Utils;

trait BlueprintsCreateBlueprint
{
    public function process()
    {
        if (!$this->modx->hasPermission('fred_blueprints_save')) {
            return $this->failure($this->modx->lexicon('fred.fe.err.permission_denied'));
        }

        $category = isset($this->body['category']) ? intval($this->body['category']) : 0;

        if (empty($this->body['name'])) {
            return $this->failure($this->modx->lexicon('fred.fe.err.blueprints_ns_name'), ['name' => $this->modx->lexicon('fred.fe.err.blueprints_ns_name')]);
        }

        if (empty($category)) {
            return $this->failure($this->modx->lexicon('fred.fe.err.blueprints_ns_category'), ['category' => $this->modx->lexicon('fred.fe.err.blueprints_ns_category')]);
        }

        if ($this->modx->getCount('FredBlueprint', ['name' => $this->body['name'], 'category' => $category]) > 0) {
            return $this->failure($this->modx->lexicon('fred.fe.err.blueprints_ae_name'), ['name' => $this->modx->lexicon('fred.fe.err.blueprints_ae_name')]);
        }

        $categoryObject = $this->modx->getObject($this->blueprintCategoryClass, ['id' => $category]);
        if (!$categoryObject) {
            return $this->failure($this->modx->lexicon('fred.fe.err.blueprints_ns_category'), ['category' => $this->modx->lexicon('fred.fe.err.blueprints_ns_category')]);
        }

        $theme = $categoryObject->Theme;
        if (!$theme) {
            return $this->failure($this->modx->lexicon('fred.fe.err.category_no_theme'), ['category' => $this->modx->lexicon('fred.fe.err.category_no_theme')]);
        }

        $rank = isset($this->body['rank']) ? intval($this->body['rank']) : 0;
        $public = isset($this->body['public']) ? intval($this->body['public']) : 0;
        $complete = isset($this->body['complete']) ? intval($this->body['complete']) : 0;
        $description = isset($this->body['description']) ? $this->body['description'] : '';

        if (!$this->modx->hasPermission('fred_blueprints_create_public')) {
            $public = 0;
        }

        if (empty($rank)) {
            $c = $this->modx->newQuery($this->blueprintClass);
            $c->where([
                'category' => $category
            ]);
            $c->sortby('`rank`', 'desc');
            $c->limit(1);

            $lastRecord = $this->modx->getIterator($this->blueprintClass, $c);
            $rank = 1;

            foreach ($lastRecord as $lastItem) {
                $rank = $lastItem->rank + 1;
                break;
            }
        }

        $blueprint = $this->modx->newObject($this->blueprintClass);
        $blueprint->set('name', $this->body['name']);
        $blueprint->set('description', $description);
        $blueprint->set('category', $category);
        $blueprint->set('rank', $rank);
        $blueprint->set('public', $public);
        $blueprint->set('createdBy', $this->modx->user->id);
        $blueprint->set('data', $this->body['data']);
        $blueprint->set('complete', $complete);
        $saved = $blueprint->save();

        if ($saved === true) {
            $templates = !empty($this->body['templates']) ? $this->body['templates'] : '';
            $templates = Utils::explodeAndClean($templates, ',', 'intval');

            foreach ($templates as $template) {
                $blueprintAccess = $this->modx->newObject($this->blueprintTemplateAccessClass);
                $blueprintAccess->set('blueprint', $blueprint->get('id'));
                $blueprintAccess->set('template', $template);
                $blueprintAccess->save();
            }

            $path = $theme->getThemeFolderPath() . 'generated/';

            $nfp = $this->modx->getOption('new_folder_permissions');
            $amode = !empty($nfp) ? octdec($this->modx->getOption('new_folder_permissions')) : 0777;
            if (!is_dir($path)) {
                mkdir($path, $amode, true);
            }

            if (!empty($this->body['generatedImage'])) {
                $type = [];
                $img = $this->body['generatedImage'];
                $isImage = preg_match('/^data:image\/([^;]+);base64,/', $img, $type);
                $imageExtension = null;
                if ($isImage) {
                    if (isset($type) && isset($type[1]) && (in_array(strtolower($type[1]), ['jpg', 'jpeg', 'png']))) {
                        $imageExtension = strtolower($type[1]);
                    }
                }

                if (empty($imageExtension)) {
                    return $this->failure($this->modx->lexicon('fred.fe.err.blueprints_incorrect_image_type'));
                }

                $fileName = 'blueprint_' . $blueprint->id . '.' . $imageExtension;

                $img = preg_replace('/^data:image\/[^;]+;base64,/', '', $img);
                $img = str_replace(' ', '+', $img);
                $data = base64_decode($img);
                $file = $path . $fileName;
                file_put_contents($file, $data);

                $blueprint->set('image', '{{theme_dir}}generated/' . $fileName . '?timestamp=' . time());
            } else {
                $blueprint->set('image', 'https://placehold.co/300x150?text=' . urlencode($this->body['name']));
            }

            $blueprint->save();

            return $this->success();
        }

        return $this->failure($this->modx->lexicon('fred.fe.err.blueprints_save'));
    }
}
