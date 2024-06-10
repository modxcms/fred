<?php

/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fred\Endpoint\Ajax;

class TaggerGetTags extends Endpoint
{
    protected $allowedMethod = ['OPTIONS', 'GET'];

    public function process()
    {
        $group = isset($_GET['group']) ? intval($_GET['group']) : 0;
        $query = isset($_GET['query']) ? $_GET['query'] : '';

        if (empty($group)) {
            return $this->failure($this->modx->lexicon('fred.fe.err.tagger_ns_group'));
        }

        $this->loadTagger();

        $where = [
            'group' => $group
        ];

        if (!empty($query)) {
            $where['tag:LIKE'] = '%' . $query . '%';
        }

        $c = $this->modx->newQuery('Tagger\\Model\\TaggerTag');
        $c->where($where);


        $c->select($this->modx->getSelectColumns('Tagger\\Model\\TaggerTag', 'TaggerTag', '', ['tag']));

        $c->prepare();
        $c->stmt->execute();

        $tags = $c->stmt->fetchAll(\PDO::FETCH_COLUMN, 0);

        return $this->data(['tags' => $tags]);
    }
}
