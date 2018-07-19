<?php

namespace Fred\Endpoint\Ajax;


class BlueprintsCreateBlueprint extends Endpoint
{
    function process()
    {
        $category = isset($this->body['category']) ? intval($this->body['category']) : 0;
        
        if (empty($this->body['name'])) {
            return $this->failure('No name was provided', ['name' => 'No name was provided']);
        }
        
        if (empty($category)) {
            return $this->failure('No category was provided', ['category' => 'No category was provided']);
        }

        $rank = isset($this->body['rank']) ? intval($this->body['rank']) : 0;
        $public = isset($this->body['public']) ? intval($this->body['public']) : 0;
        $complete = isset($this->body['complete']) ? intval($this->body['complete']) : 0;
        $description = isset($this->body['description']) ? $this->body['description'] : '';
        
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
            $path = $this->fred->getOption('generated_images_path');
            $url = $this->fred->getOption('generated_images_url');
    
            $path = str_replace('{assets_path}', $this->modx->getOption('assets_path'), $path);
            $url = str_replace('{assets_url}', $this->modx->getOption('assets_url'), $url);

            $path = str_replace('//', '/', $path);
            $url = str_replace('//', '/', $url);
            
            $path = rtrim($path, '/') . '/';
            $url = rtrim($url, '/') . '/';

            $nfp = $this->modx->getOption('new_folder_permissions');
            $amode = !empty($nfp) ? octdec($this->modx->getOption('new_folder_permissions')) : 0777;
            if (!is_dir($path)) {
                mkdir($path, $amode, true);
            }
            
            if (!empty($this->body['generatedImage'])) {
                $img = $this->body['generatedImage'];
                $img = str_replace('data:image/png;base64,', '', $img);
                $img = str_replace(' ', '+', $img);
                $data = base64_decode($img);
                $file = $path . 'blueprint_' . $blueprint->id . '.png';
                file_put_contents($file, $data);

                $blueprint->set('image', $url . 'blueprint_' . $blueprint->id . '.png');
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
