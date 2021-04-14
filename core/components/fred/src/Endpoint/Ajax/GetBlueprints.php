<?php

namespace Fred\Endpoint\Ajax;

use Fred\Model\FredBlueprint;
use Fred\Model\FredBlueprintCategory;
use Fred\Model\FredBlueprintCategoryTemplateAccess;
use Fred\Model\FredBlueprintTemplateAccess;

class GetBlueprints extends Endpoint
{
    protected $allowedMethod = ['OPTIONS', 'GET'];

    public function process()
    {
        $data = [];

        $theme = isset($_GET['theme']) ? intval($_GET['theme']) : 0;

        $complete = isset($_GET['complete']) ? intval($_GET['complete']) : -1;
        if (($complete !== 0) && ($complete !== 1)) $complete = -1;

        $c = $this->modx->newQuery(FredBlueprintCategory::class);
        $c->leftJoin(FredBlueprintCategoryTemplateAccess::class, 'BlueprintCategoryTemplatesAccess');

        $c->where(
            [
                'BlueprintCategoryTemplatesAccess.template' => $this->getClaim('template'),
                'OR:BlueprintCategoryTemplatesAccess.template:IS' => null,
            ]
        );

        $c->where([
            'public' => true,
            'OR:createdBy:=' => $this->modx->user->id
        ]);

        if (!empty($theme)) {
            $c->where(['theme' => $theme]);
        }

        $categorySort = $this->fred->getOption('blueprint_category_sort', [], 'name');
        $blueprintSort = $this->fred->getOption('blueprint_sort', [], 'name');

        $c->sortby($categorySort);

        /** @var FredBlueprintCategory[] $categories */
        $categories = $this->modx->getIterator(FredBlueprintCategory::class, $c);

        foreach ($categories as $category) {
            $categoryBlueprints = [
                'category' => $category->name,
                'id' => $category->id,
                'blueprints' => []
            ];

            $blueprintWhere = [
                'category' => $category->id,
                [
                    'BlueprintTemplatesAccess.template' => $this->getClaim('template'),
                    'OR:BlueprintTemplatesAccess.template:IS' => null
                ]
            ];

            if ($complete !== -1) {
                $blueprintWhere['complete'] = $complete;
            }

            $blueprintWhere[] = [
                'public' => true,
                'OR:createdBy:=' => $this->modx->user->id
            ];

            $bC = $this->modx->newQuery(FredBlueprint::class);
            $bC->leftJoin(FredBlueprintTemplateAccess::class, 'BlueprintTemplatesAccess');

            $bC->where($blueprintWhere);
            $bC->sortby($blueprintSort);

            /** @var FredBlueprint[] $blueprints */
            $blueprints = $this->modx->getIterator(FredBlueprint::class, $bC);
            foreach ($blueprints as $blueprint) {
                $categoryBlueprints['blueprints'][] = [
                    "id" => $blueprint->id,
                    "name" => $blueprint->name,
                    "description" => $blueprint->description,
                    "image" => $blueprint->getImage(),
                    "public" => $blueprint->get('public'),
                    "complete" => $blueprint->get('complete'),
                ];
            }

            $data[] = $categoryBlueprints;
        }

        return $this->data(['blueprints' => $data]);
    }
}
