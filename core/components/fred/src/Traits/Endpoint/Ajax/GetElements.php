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

trait GetElements
{
    protected $allowedMethod = ['OPTIONS', 'GET'];

    public function process()
    {
        $theme = isset($_GET['theme']) ? intval($_GET['theme']) : 0;

        $groupSort = $this->fred->getOption('element_group_sort');
        if ($groupSort !== 'rank') {
            $groupSort = 'name';
        }

        $elements = [];

        $c = $this->modx->newQuery($this->elementCategoryClass);
        $c->leftJoin($this->elementCategoryTemplateAccessClass, 'ElementCategoryTemplatesAccess');

        $c->where(
            [
                'ElementCategoryTemplatesAccess.template' => $this->getClaim('template'),
                'OR:ElementCategoryTemplatesAccess.template:IS' => null,
            ]
        );

        if (!empty($theme)) {
            $c->where([
                'theme' => $theme
            ]);
        }

        $c->sortby($groupSort);

        /** @var $categories */
        $categories = $this->modx->getIterator($this->elementCategoryClass, $c);

        $elementSort = $this->fred->getOption('element_sort');
        if ($elementSort !== 'rank') {
            $elementSort = 'name';
        }

        foreach ($categories as $category) {
            $categoryElements = [
                'category' => $category->name,
                'elements' => []
            ];

            $elementCriteria = $this->modx->newQuery($this->elementClass);
            $elementCriteria->leftJoin($this->elementTemplateAccessClass, 'ElementTemplatesAccess');

            $elementCriteria->where(
                [
                    'category' => $category->id,
                    [
                        'ElementTemplatesAccess.template' => $this->getClaim('template'),
                        'OR:ElementTemplatesAccess.template:IS' => null,
                    ]
                ]
            );
            $elementCriteria->sortby($elementSort);

            /** @var $fredElements */
            $fredElements = $this->modx->getIterator($this->elementClass, $elementCriteria);
            foreach ($fredElements as $element) {
                $categoryElements['elements'][] = [
                    "id" => $element->uuid,
                    "title" => $element->name,
                    "description" => $element->description,
                    "image" => $element->getImage(),
                    "content" => $element->content,
                    "options" => $element->processOptions()
                ];
            }

            $elements[] = $categoryElements;
        }

        return $this->data(['elements' => $elements]);
    }
}
