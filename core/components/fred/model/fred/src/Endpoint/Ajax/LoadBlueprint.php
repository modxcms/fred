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

    protected function gatherElements(&$elements, &$dropZones)
    {
        foreach ($dropZones as &$dropZone) {
            $this->iterateElements($elements, $dropZone);
        }
    }

    protected function iterateElements(&$elements, &$dropZone) {
        foreach ($dropZone as &$element) {
            $elementId = $element['widget'];
            $element['elId'] = null;

            if (!isset($elements[$elementId])) {
                $elements[$elementId] = $this->getElement($elementId);
            }

            $this->gatherElements($elements, $element['children']);
        }
    }

    protected function getElement($uuid)
    {
        /** @var \FredElement $element */
        $element = $this->modx->getObject('FredElement', ['uuid' => $uuid]);
        if (!$element) {
            $this->modx->log(\modX::LOG_LEVEL_ERROR, "[Fred] Element {$uuid} wasn't found.");
            return ['html' => '', 'options' => [], 'title' => ''];
        }

        return [
            'html' => $element->content,
            'title' => $element->name,
            'options' => $element->processOptions()
        ];
    }
}
