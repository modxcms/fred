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

        $data = $this->fixData($data);
        
        $this->gatherElements($elements, $data);

        $pageSettings = [
            'pagetitle' => $object->pagetitle,
            'longtitle' => $object->longtitle,
            'description' => $object->description,
            'introtext' => $object->introtext,
            'menutitle' => $object->menutitle,
            'alias' => $object->alias,
            'published' => $object->published == 1,
            'hidemenu' => $object->hidemenu == 1,
            'menuindex' => (int)$object->menuindex,
            'publishedon' => $object->publishedon,
            'publishon' => $object->pub_date,
            'unpublishon' => $object->unpub_date,
        ];

        return $this->data([
            "pageSettings" => $pageSettings,
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

            $description = str_replace($matches[0], '', $description);
        }

        return [
            'html' => $chunk->content,
            'title' => $chunk->name,
            'options' => $options
        ];
    }

    /**
     * Temporal method to fix data model change
     *
     * @param $data
     * @return mixed
     */
    private function fixData($data)
    {
        foreach ($data as $dz => &$elements) {
            foreach ($elements as &$element) {
                foreach ($element['values'] as $key => $value) {
                    if (!is_array($value)) {
                        $element['values'][$key] = ['_raw' => ['_value' => $value]];
                    }
                }

                $element['children'] = $this->fixData($element['children']);
            }
        }
        
        return $data;
    }


}
