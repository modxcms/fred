<?php

namespace Fred\Endpoint\Ajax;

class LoadBlueprint extends Endpoint
{
    protected $allowedMethod = ['GET', 'OPTIONS'];

    function process()
    {
        $id = isset($_GET['blueprint']) ? intval($_GET['blueprint']) : 0;

        if (empty($id)) {
            return $this->failure('No id was provided');
        }

        /** @var \FredBlueprint $blueprint */
        $blueprint = $this->modx->getObject('FredBlueprint', $id);
        $complete = $blueprint->get('complete');
        
        $data = $blueprint->get('data');
        $elements = [];

        if ($complete === true) {
            $this->gatherElements($elements, $data);
        } else {
            $this->iterateElements($elements, $data);
        }

        return $this->data([
            "data" => $data,
            "elements" => $elements,
            "complete" => $complete
        ]);
    }

    protected function gatherElements(&$elements, $dropZones)
    {
        foreach ($dropZones as $dropZone) {
            $this->iterateElements($elements, $dropZone);
        }
    }
    
    protected function iterateElements(&$elements, $dropZone) {
        foreach ($dropZone as $element) {
            $elementId = intval($element['widget']);

            if (!isset($elements[$elementId])) {
                $elements[$elementId] = $this->getElement($elementId);
            }

            $this->gatherElements($elements, $element['children']);
        }
    }

    protected function getElement($id)
    {
        /** @var \modChunk $chunk */
        $chunk = $this->modx->getObject('modChunk', $id);
        if (!$chunk) {
            $this->modx->log(\modX::LOG_LEVEL_ERROR, "[Fred] Chunk {$id} wasn't found.");
            return ['html' => '', 'options' => [], 'title' => ''];
        }

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

        return [
            'html' => $chunk->content,
            'title' => $chunk->name,
            'options' => $options
        ];
    }
}
