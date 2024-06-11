<?php

/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fred\v2\Endpoint\Ajax;

use Fred\Utils;

class GetResources extends Endpoint
{
    protected $allowedMethod = ['OPTIONS', 'GET'];
    protected $resources = [];

    /**
     * @return string
     */
    public function process()
    {
        $context = $this->getClaim('context');
        $context = !empty($context) ? $context : 'web';

        $query = $_GET['query'];
        $current = isset($_GET['current']) ? (int)$_GET['current'] : 0;
        $parents = $_GET['parents'] ?? '';
        $resources = $_GET['resources'] ?? '';
        $depth = isset($_GET['depth']) ? (int)$_GET['depth'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 25;

        $parents = Utils::explodeAndClean($parents, ',', 'intval', 0, 'strlen');
        $resources = Utils::explodeAndClean($resources, ',', 'intval');

        $currentResource = null;

        if (!empty($current)) {
            /** @var \modResource $currentResource */
            $currentResource = $this->modx->getObject('modResource', $current);
            if ($currentResource) {
                $currentResource = [
                    'id' => $currentResource->id,
                    'value' => (string)$currentResource->id,
                    'pagetitle' => $currentResource->pagetitle,
                    'customProperties' => [
                        'url' => $this->modx->makeUrl($currentResource->id, $context, '', 'abs')
                    ]
                ];
            } else {
                $currentResource = null;
            }
        }

        $c = $this->modx->newQuery('modResource');
        $where = [
            'context_key' => $context
        ];

        if (!empty($current)) {
            $where['id:!='] = $current;
        }

        if (!empty($parents) || !empty($resources)) {
            $resourceIDs = [];

            if (!empty($resources)) {
                $resourceIDs = $resources;
            } else {
                foreach ($parents as $parent) {
                    $resourceIDs[] = $parent;

                    $childIDs = $this->modx->getChildIds($parent, $depth, ['context' => $context]);
                    if (!empty($childIDs)) {
                        $resourceIDs = array_merge($resourceIDs, $childIDs);
                    }
                }

                $resourceIDs = array_keys(array_flip($resourceIDs));
            }

            $where['id:IN'] = $resourceIDs;
        }

        $c->limit($limit);
        $c->sortby('menuindex', 'ASC');

        if (!empty($query)) {
            $where['pagetitle:LIKE'] = '%' . $query . '%';
            $where['OR:id:='] = intval($query);
        }

        $c->where($where);

        $data = [];

        /** @var \modResource[] $resourcesIterator */
        $resourcesIterator = $this->modx->getIterator('modResource', $c);

        foreach ($resourcesIterator as $resource) {
            if (!$resource->checkPolicy('list')) {
                continue;
            }
            $data[] = [
                'id' => $resource->id,
                'value' => (string)$resource->id,
                'pagetitle' => $resource->pagetitle,
                'customProperties' => [
                    'url' => $this->modx->makeUrl($resource->id, $context, '', 'abs')
                ]
            ];
        }

        return $this->data(['resources' => $data, 'current' => $currentResource]);
    }
}
