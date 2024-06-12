<?php

/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fred\Traits\Endpoint\Ajax;

use Fred\Utils;

trait GetChunks
{
    /**
     * @return string
     */
    public function process()
    {
        $query = $_GET['query'];
        $current = isset($_GET['current']) ? (int)$_GET['current'] : 0;
        $category = $_GET['category'] ?? '';
        $chunks = $_GET['chunks'] ?? '';
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 25;

        $category = Utils::explodeAndClean($category, ',', 'intval', 0, 'strlen');
        $chunks = Utils::explodeAndClean($chunks, ',', 'intval');

        $c = $this->modx->newQuery($this->chunkClass);

        $where = [];

        $currentChunk = null;
        if (!empty($current)) {
            /** @var $currentChunk */
            $currentChunk = $this->modx->getObject($this->chunkClass, $current);
            if ($currentChunk) {
                $currentChunk = [
                    'id' => $currentChunk->id,
                    'value' => (string)$currentChunk->id,
                    'name' => $currentChunk->name,
                ];
                $where['id:!='] = $current;
            }
        }

        if (!empty($chunks)) {
            $where['id:IN'] = $chunks;
        }

        if (!empty($category)) {
            $where['category:IN'] = $category;
        }

        $c->limit($limit);
        $c->sortby('name', 'ASC');

        if (!empty($query)) {
            $where['name:LIKE'] = '%' . $query . '%';
            $where['OR:id:='] = (int)$query;
        }

        $c->where($where);

        $data = [];

        /** @var $chunksIterator */
        $chunksIterator = $this->modx->getIterator($this->chunkClass, $c);

        foreach ($chunksIterator as $chunk) {
            if (!$chunk->checkPolicy('list')) {
                continue;
            }
            $data[] = [
                'id' => $chunk->id,
                'value' => (string)$chunk->id,
                'name' => $chunk->name,
            ];
        }

        return $this->data(['chunks' => $data, 'current' => $currentChunk]);
    }
}
