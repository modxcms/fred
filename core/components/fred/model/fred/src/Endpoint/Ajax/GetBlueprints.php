<?php

namespace Fred\Endpoint\Ajax;

class GetBlueprints extends Endpoint
{
    protected $allowedMethod = ['OPTIONS', 'GET'];
    
    public function process()
    {
        $data = [];

        $c = $this->modx->newQuery('FredBlueprintCategory');
        $c->where([
            'public' => true,
            'OR:createdBy:=' => $this->modx->user->id
        ]);
        
        /** @var \FredBlueprintCategory[] $categories */
        $categories = $this->modx->getIterator('FredBlueprintCategory', $c);
        
        foreach ($categories as $category) {
            $categoryBlueprints = [
                'category' => $category->name,
                'id' => $category->id,
                'blueprints' => []
            ];
            
            /** @var \FredBlueprint[] $blueprints */
            $blueprints = $this->modx->getIterator('FredBlueprint', [
                'category' => $category->id, 
                [
                    'public' => true,
                    'OR:createdBy:=' => $this->modx->user->id    
                ]
            ]);
            foreach ($blueprints as $blueprint) {
                $categoryBlueprints['blueprints'][] = [
                    "id" => $blueprint->id,
                    "name" => $blueprint->name,
                    "description" => $blueprint->description,
                    "image" => $blueprint->image,
                    "public" => $blueprint->get('public'),
                ];
            }
            
            $data[] = $categoryBlueprints;
        }

        return $this->data(['blueprints' => $data]);
    }
}