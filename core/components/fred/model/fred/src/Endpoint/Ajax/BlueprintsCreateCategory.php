<?php

namespace Fred\Endpoint\Ajax;


class BlueprintsCreateCategory extends Endpoint
{
    function process()
    {
        if (!$this->modx->hasPermission('fred_blueprint_categories_save')) {
            return $this->failure('Permission denied.');
        }
        
        if (empty($this->body['name'])) {
            return $this->failure('No name was provided', ['name' => 'No name was provided']);
        }

        $theme = isset($this->body['theme']) ? intval($this->body['theme']) : 0;
        
        if (empty($theme)) {
            return $this->failure('No theme was provided', ['theme' => 'No theme was provided']);
        }

        if ($this->modx->getCount('FredBlueprintCategory', ['name' => $this->body['name'], 'theme' => $theme]) > 0) {
            return $this->failure('Blueprint Category with this name already exists.', ['name' => 'Blueprint Category with this name already exists.']);
        }

        $rank = isset($this->body['rank']) ? intval($this->body['rank']) : 0;
        $public = isset($this->body['public']) ? intval($this->body['public']) : 0;

        if (!$this->modx->hasPermission('fred_blueprint_categories_create_public')) {
            $public = 0;
        }
        
        if (empty($rank)) {
            $c = $this->modx->newQuery('FredBlueprintCategory');
            $c->sortby('rank', 'desc');
            $c->limit(1);

            $lastRecord = $this->modx->getIterator('FredBlueprintCategory', $c);
            $rank = 1;
         
            foreach ($lastRecord as $lastItem) {
                $rank = $lastItem->rank + 1;
                break;
            }
        }

        $category = $this->modx->newObject('FredBlueprintCategory');
        $category->set('name', $this->body['name']);
        $category->set('theme', $theme);
        $category->set('rank', $rank);
        $category->set('public', $public);
        $category->set('createdBy', $this->modx->user->id);
        $category->save();
       
        return $this->success();
    }
}
