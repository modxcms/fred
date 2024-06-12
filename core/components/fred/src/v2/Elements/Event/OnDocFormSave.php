<?php

namespace Fred\v2\Elements\Event;

class OnDocFormSave extends Event
{
    public function run()
    {
        $mode = $this->sp['mode'] ?? '';
        $resource = $this->sp['resource'] ?? null;
        if ($mode !== 'upd' || !$resource) {
            return;
        }

        if (in_array($resource->class_key, $this->disabledClassKeys)) {
            return;
        }

        if (empty($this->fred->getTheme($resource->template))) {
            return;
        }

        $renderResource = new \Fred\v2\RenderResource($resource, $this->modx);
        $renderResource->render();

        $this->modx->invokeEvent('FredOnFredResourceSave', [
            'id' => $resource->get('id'),
            'resource' => &$resource
        ]);
    }
}
