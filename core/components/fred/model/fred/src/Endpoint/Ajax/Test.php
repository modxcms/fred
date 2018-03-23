<?php

namespace Fred\Endpoint\Ajax;

class Test extends Endpoint
{
    protected $allowedMethod = ['GET', 'OPTIONS'];
    
    function process()
    {

        $query = !empty($_GET['query']) ? $_GET['query'] : '';
        
        if (empty($query)) {
            return $this->data([
                "data" => [
                ]
            ]);    
        }
        
        $c = $this->modx->newQuery('modResource');
        $c->where([
            'pagetitle:LIKE' => $query . '%',
            'deleted' => false,
            'published' => true
        ]);
        
        $resources = $this->modx->getIterator('modResource', $c);

        $data = [];
        
        foreach ($resources as $resource) {
            $data[] = [
                'id' => $resource->id,
                'title' => $resource->pagetitle,
                'url' => $this->modx->makeUrl($resource->id, '', '', 'full')
            ];
        }
        
        return $this->data([
            "data" => $data
        ]);
    }
    


}
