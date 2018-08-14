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

class GetElements extends Endpoint
{
    protected $allowedMethod = ['OPTIONS', 'GET'];
    
    public function process()
    {
        $theme = isset($_GET['theme']) ? intval($_GET['theme']) : 0;
        
        $groupSort = $this->fred->getOption('element_group_sort');
        if ($groupSort !== 'rank') $groupSort = 'name';
        
        $elements = [];

        $c = $this->modx->newQuery('FredElementCategory');
        
        if (!empty($theme)) {
            $c->where([
                'theme' => $theme
            ]);
        }
        
        $c->sortby($groupSort);
        
        /** @var \FredElementCategory[] $categories */
        $categories = $this->modx->getIterator('FredElementCategory', $c);
        
        foreach ($categories as $category) {
            $categoryElements = [
                'category' => $category->name,
                'elements' => []
            ];
            
            /** @var \FredElement[] $fredElements */
            $fredElements = $this->modx->getIterator('FredElement', ['category' => $category->id]);
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