<?php

namespace Fred\Endpoint\Ajax;

class RteGetResources extends Endpoint
{
    protected $allowedMethod = ['OPTIONS', 'GET'];
    protected $templates = [];
    protected $map = [];
    protected $resources = [];

    /**
     * @return string
     */
    function process()
    {
        $context = 'web';
        
        $query = $_GET['query'];
        $id = intval($_GET['id']);

        if (!empty($id)) {
            $resource = $this->modx->getObject('modResource', $id);
            if ($resource) {
                return $this->data(['resource' => [
                    'id' => $resource->id,
                    'value' => (string)$resource->id,
                    'pagetitle' => $resource->pagetitle,
                    'customProperties' => [
                        'url' => $this->modx->makeUrl($resource->id, $context, '', 'abs')
                    ]
                ]]);
            }
        }
        
        $c = $this->modx->newQuery('modResource');
        $where = [
            'context_key' => $context
        ];
        
        $c->limit(10);
        
        if (!empty($query)) {
            $where['pagetitle:LIKE'] = '%' . $query . '%';
        }
        
        $c->where($where);

        $data = [];
        $resources = $this->modx->getIterator('modResource', $c);
        
        foreach ($resources as $resource) {
            $data[] = [
                'id' => $resource->id,
                'value' => (string)$resource->id,
                'pagetitle' => $resource->pagetitle,
                'customProperties' => [
                    'url' => $this->modx->makeUrl($resource->id, $context, '', 'abs')
                ]
            ];
        }

        return $this->data(['resources' => $data]);
    }
}
