<?php

namespace Fred\Endpoint\Ajax;

class GetBlueprints extends Endpoint
{
    protected $allowedMethod = ['OPTIONS', 'GET'];
    
    public function process()
    {
        $data = [];
        
        $complete = isset($_GET['complete']) ? intval($_GET['complete']) : -1;
        if (($complete !== 0) && ($complete !== 1)) $complete = -1;

        $c = $this->modx->newQuery('FredBlueprintCategory');
        $c->where([
            'public' => true,
            'OR:createdBy:=' => $this->modx->user->id
        ]);

        $categorySort = $this->fred->getOption('blueprint_category_sort', 'name');
        $blueprintSort = $this->fred->getOption('blueprint_sort', 'name');
        
        $c->sortby($categorySort);
        
        /** @var \FredBlueprintCategory[] $categories */
        $categories = $this->modx->getIterator('FredBlueprintCategory', $c);
        
        foreach ($categories as $category) {
            $categoryBlueprints = [
                'category' => $category->name,
                'id' => $category->id,
                'blueprints' => []
            ];

            $blueprintWhere = [
                'category' => $category->id
            ];
            
            if ($complete !== -1) {
                $blueprintWhere['complete'] = $complete;
            }
            
            $blueprintWhere[] = [
                'public' => true,
                'OR:createdBy:=' => $this->modx->user->id
            ];

            $bC = $this->modx->newQuery('FredBlueprint');
            $bC->where($blueprintWhere);
            $bC->sortby($blueprintSort);
            
            /** @var \FredBlueprint[] $blueprints */
            $blueprints = $this->modx->getIterator('FredBlueprint', $bC);
            foreach ($blueprints as $blueprint) {
                $categoryBlueprints['blueprints'][] = [
                    "id" => $blueprint->id,
                    "name" => $blueprint->name,
                    "description" => $blueprint->description,
                    "image" => $blueprint->image,
                    "public" => $blueprint->get('public'),
                    "complete" => $blueprint->get('complete'),
                ];
            }
            
            $data[] = $categoryBlueprints;
        }

        return $this->data(['blueprints' => $data]);
    }
}