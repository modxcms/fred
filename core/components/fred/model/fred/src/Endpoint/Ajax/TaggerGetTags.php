<?php

namespace Fred\Endpoint\Ajax;

class TaggerGetTags extends Endpoint
{
    protected $allowedMethod = ['OPTIONS', 'GET'];
    
    public function process()
    {
        $group = isset($_GET['group']) ? intval($_GET['group']) : 0;
        $query = isset($_GET['query']) ? $_GET['query'] : '';

        if (empty($group)) {
            return $this->failure('No group was provided');
        }

        $this->loadTagger();
        
        $where = [
            'group' => $group
        ];
        
        if (!empty($query)) {
            $where['tag:LIKE'] = '%' . $query . '%';
        }
        
        $c = $this->modx->newQuery('TaggerTag');
        $c->where($where);

        
        $c->select($this->modx->getSelectColumns('TaggerTag', 'TaggerTag', '', ['tag']));

        $c->prepare();
        $c->stmt->execute();
        
        $tags = $c->stmt->fetchAll(\PDO::FETCH_COLUMN, 0);

        return $this->data(['tags' => $tags]);
    }
}