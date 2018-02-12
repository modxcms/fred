<?php

namespace Fred\Endpoint\Ajax;

use \Wa72\HtmlPageDom\HtmlPageCrawler;

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
        $content = [];
        
        foreach ($data as $dropZoneName => $dropZone) {
            $content[$dropZoneName] = [];
            
            foreach ($dropZone as $element) {
                $dom = $this->getHTML($element['widget']);
                $this->fillValues($dom, $element['values']);
                $this->fillDropZones($dom, $element['children']);

                $content[$dropZoneName][] = '<div class="fred-api" data-fred-element-id="' . $element['widget'] . '">' . $dom->saveHTML() . '</div>';
            }
            
        }

        return $this->data(["data" => $content]);
    }

    protected function getHTML($id)
    {
        $id = intval($id);
        
        /** @var \modChunk $chunk */
        $chunk = $this->modx->getObject('modChunk', $id);
        if (!$chunk) {
            return '';
        }

        $dom = new HtmlPageCrawler($chunk->content);
        
        return $dom;
    }


    protected function fillValues(HtmlPageCrawler $dom, $values)
    {
        $fields = $dom->filter('[data-fred-name]');
        
        $fields->each(function($node, $i) use ($values) {
            $fieldName = $node->getAttribute('data-fred-name');
            if (isset($values[$fieldName])) {
                switch($node->nodeName()) {
                    case 'img':
                        $node->setAttribute('src', $values[$fieldName]);
                        break;
                    default:
                        $node->html($values[$fieldName]);
                }
            } else {
                $node->html('');
            }
        });
        
        return $dom;
    }
    
    protected function fillDropZones($dom, $dropZones)
    {
        $dom->filter('[data-fred-dropzone]')->each(function($node, $i) use ($dropZones) {
            $zoneName = $node->getAttribute('data-fred-dropzone');
            
            if (isset($dropZones[$zoneName])) {
                foreach ($dropZones[$zoneName] as $element) {
                    
                    $dom = $this->getHTML($element['widget']);
                    $this->fillValues($dom, $element['values']);
                    $this->fillDropZones($dom, $element['children']);
                    
                    $node->append('<div class="fred-api" data-fred-element-id="' . $element['widget'] . '">' . $dom->saveHTML() . '</div>');
                }
            }
        });
        
        return $dom;
    }
    
}
