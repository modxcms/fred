<?php

namespace Fred\Endpoint\Ajax;


class BlueprintsCreateBlueprint extends Endpoint
{
    function process()
    {
        if (!$this->modx->hasPermission('fred_blueprints_save')) {
            return $this->failure('Permission denied.');
        }
        
        $category = isset($this->body['category']) ? intval($this->body['category']) : 0;
        
        if (empty($this->body['name'])) {
            return $this->failure('No name was provided', ['name' => 'No name was provided']);
        }
        
        if (empty($category)) {
            return $this->failure('No category was provided', ['category' => 'No category was provided']);
        }
        
        /** @var \FredBlueprintCategory $categoryObject */
        $categoryObject = $this->modx->getObject('FredBlueprintCategory', ['id' => $category]);
        if (!$categoryObject) {
            return $this->failure('No category was provided', ['category' => 'No category was provided']);
        }

        $theme = $categoryObject->Theme;
        if (!$theme) {
            return $this->failure('Category doesn\'t have theme.', ['category' => 'Category doesn\'t have theme.']);
        }

        $rank = isset($this->body['rank']) ? intval($this->body['rank']) : 0;
        $public = isset($this->body['public']) ? intval($this->body['public']) : 0;
        $complete = isset($this->body['complete']) ? intval($this->body['complete']) : 0;
        $description = isset($this->body['description']) ? $this->body['description'] : '';

        if (!$this->modx->hasPermission('fred_blueprints_create_public')) {
            $public = 0;
        }
        
        if (empty($rank)) {
            $c = $this->modx->newQuery('FredBlueprint');
            $c->where([
                'category' => $category 
            ]);
            $c->sortby('rank', 'desc');
            $c->limit(1);

            $lastRecord = $this->modx->getIterator('FredBlueprint', $c);
            $rank = 1;

            foreach ($lastRecord as $lastItem) {
                $rank = $lastItem->rank + 1;
                break;
            }
        }

        $blueprint = $this->modx->newObject('FredBlueprint');
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
            $path = $theme->getThemeFolderPath() . 'generated/';
            
            $nfp = $this->modx->getOption('new_folder_permissions');
            $amode = !empty($nfp) ? octdec($this->modx->getOption('new_folder_permissions')) : 0777;
            if (!is_dir($path)) {
                mkdir($path, $amode, true);
            }
            
            if (!empty($this->body['generatedImage'])) {
                $fileName = 'blueprint_' . $blueprint->id . '_' . time() . '.png';
                
                $img = $this->body['generatedImage'];
                $img = str_replace('data:image/png;base64,', '', $img);
                $img = str_replace(' ', '+', $img);
                $data = base64_decode($img);
                $file = $path . $fileName;
                file_put_contents($file, $data);

                $blueprint->set('image', '{{theme_dir}}generated/' . $fileName);
            } else if (!empty($this->body['image'])) {
                $blueprint->set('image', $this->body['image']);
            } else {
                $blueprint->set('image', 'https://via.placeholder.com/300x150?text=' . urlencode($this->body['name']));
            }

            $blueprint->save();
           
            return $this->success();
        }

        return $this->failure('Saving Blueprint failed.');
    }
}
