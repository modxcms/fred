<?php

namespace Fred\Endpoint\Ajax;

class GetElements extends Endpoint
{
    protected $allowedMethod = ['OPTIONS', 'GET'];
    
    public function process()
    {
        $categoryId = $this->fred->getOption('elements_category_id');
        $groupSort = $this->fred->getOption('element_group_sort');
        if ($groupSort !== 'rank') $groupSort = 'category';
        
        if (empty($categoryId)) {
            return $this->data(['elements' => []]);
        }
        
        $elements = [];

        $c = $this->modx->newQuery('modCategory');
        $c->where([
            'parent' => $categoryId
        ]);
        $c->sortby($groupSort);
        
        /** @var \modCategory[] $categories */
        $categories = $this->modx->getIterator('modCategory', $c);
        
        foreach ($categories as $category) {
            $categoryElements = [
                'category' => $category->category,
                'elements' => []
            ];
            
            /** @var \modChunk[] $chunks */
            $chunks = $this->modx->getIterator('modChunk', ['category' => $category->id]);
            foreach ($chunks as $chunk) {
                $matches = [];
                preg_match('/image:([^\n]+)\n?/', $chunk->description, $matches);

                $image = '';
                $options = [];
                $description = $chunk->description;

                if (count($matches) == 2) {
                    $image = $matches[1];
                    $description = str_replace($matches[0], '', $description);
                }

                $matches = [];
                preg_match('/options:([^\n]+)\n?/', $description, $matches);

                if (count($matches) == 2) {
                    $options = $this->modx->getChunk($matches[1]);
                    $options = json_decode($options, true);
                    if (empty($options)) $options = [];

                    $globalRte = $this->fred->getOption('rte_config');
                    if (!empty($globalRte)) {
                        $globalRte = $this->modx->getChunk($globalRte);
                        $globalRte = json_decode($globalRte, true);

                        if (!empty($globalRte)) {
                            $rteConfig = $globalRte;

                            if (!empty($options['rteConfig'])) {
                                $rteConfig = array_merge($rteConfig, $options['rteConfig']);
                            }

                            $options['rteConfig'] = $rteConfig;
                        }
                    }
                    
                    $description = str_replace($matches[0], '', $description);
                }

                $categoryElements['elements'][] = [
                    "id" => $chunk->id,
                    "title" => $chunk->name,
                    "description" => $description,
                    "image" => $image,
                    "content" => $chunk->content,
                    "options" => $options
                ];
            }
            
            $elements[] = $categoryElements;
        }
        
        

        return $this->data(['elements' => $elements]);
    }
}