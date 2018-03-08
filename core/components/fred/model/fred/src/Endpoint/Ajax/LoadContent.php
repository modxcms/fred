<?php

namespace Fred\Endpoint\Ajax;

class LoadContent extends Endpoint
{
    protected $allowedMethod = ['GET', 'OPTIONS'];
    
    function process()
    {
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        
        if (empty($id)) {
            return $this->failure('No id was provided');
        }
        

        /** @var \modResource $object */
        $object = $this->modx->getObject('modResource', $id);
        if (!$object instanceof \modResource) {
            return $this->failure('Could not load resource with id ' . $id);
        }

        $data = $object->getProperty('data', 'fred');
        $elements = [];
        
        $this->gatherElements($elements, $data);
        

        return $this->data([
            "data" => $data, 
            "elements" => $elements
        ]);
    }
    
    protected function gatherElements(&$elements, $dropZones) {
        foreach ($dropZones as $dropZone) {
            foreach ($dropZone as $element) {
                $elementId = intval($element['widget']);
                
                if (!isset($elements[$elementId])) {
                    $elements[$elementId] = $this->getElement($elementId);
                }
                
                $this->gatherElements($elements, $element['children']);
            }
        }
    }

    protected function getElement($id)
    {
        /** @var \modChunk $chunk */
        $chunk = $this->modx->getObject('modChunk', $id);
        if (!$chunk) {
            $this->modx->log(\modX::LOG_LEVEL_ERROR, "[Fred] Chunk {$id} wasn't found.");
            return ['html' => '', 'options' => []];
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
            $options = $matches[1];
            $options = json_decode($options, true);
            if (empty($options)) $options = [];

            $description = str_replace($matches[0], '', $description);
        }

        return [
            'html' => $chunk->content,
            'options' => $options
        ];
    }

    
}
