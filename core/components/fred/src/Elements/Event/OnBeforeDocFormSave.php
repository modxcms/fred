<?php

namespace Fred\Elements\Event;

class OnBeforeDocFormSave extends Event
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

        $data = $resource->getProperty('data', 'fred');
        if (!empty($data['fingerprint'])) {
            if (empty($resource->fingerprint)) {
                $this->modx->event->_output = 'No fingerprint was provided.';
                return;
            }

            if ($data['fingerprint'] !== $resource->fingerprint) {
                $this->modx->event->_output = 'Your page is outdated, please reload the page.';
                return;
            }
        }

        $beforeSave = $this->modx->invokeEvent('FredOnBeforeFredResourceSave', [
            'id' => $resource->get('id'),
            'resource' => &$resource
        ]);

        if (is_array($beforeSave)) {
            $preventSave = false;

            foreach ($beforeSave as $msg) {
                if (!empty($msg)) {
                    $preventSave .= $msg . " ";
                }
            }
        } else {
            $preventSave = $beforeSave;
        }

        if ($preventSave !== false) {
            $this->modx->event->_output = $preventSave;
            return;
        }
    }
}
