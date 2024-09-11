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
        $catArr = [];
        foreach(explode(",", $category) as $cat) {
            if (is_numeric($cat)) {
                $catArr[] = $cat;
            } else {
                $obj = $this->modx->getObject($this->categoryClass, ['name' => $cat]);
                if (!empty($obj)) {
                    $catArr[] = $obj->get('id');
                }
            }
        }
        $category = $catArr;

        $chunkArr = [];
        foreach(explode(",", $chunks) as $chunk) {
            if (is_numeric($chunk)) {
                $chunkArr[] = $chunk;
            } else {
                $obj = $this->modx->getObject($this->chunkClass, ['name' => $chunk]);
                if (!empty($obj) && !in_array($obj->get('id'), $chunkArr)) {
                    $chunkArr[] = $obj->get('id');
                }
            }
        }
        $chunks = $chunkArr;

        $c = $this->modx->newQuery($this->chunkClass);

        $where = [];

        $currentChunk = null;
        if (!empty($current)) {
            /** @var $currentChunk */
            $currentChunk = $this->modx->getObject($this->chunkClass, $current);
            if ($currentChunk) {
                $currentChunk = [
                    'id' => $currentChunk->get('id'),
                    'value' => (string)$currentChunk->get('id'),
                    'name' => $currentChunk->get('name'),
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
                'id' => $chunk->get('id'),
                'value' => (string)$chunk->get('id'),
                'name' => $chunk->get('name'),
            ];
        }

        return $this->data(['chunks' => $data, 'current' => $currentChunk]);
    }
}
