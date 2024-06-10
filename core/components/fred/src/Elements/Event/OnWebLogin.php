<?php

namespace Fred\Elements\Event;

class OnWebLogin extends Event
{
    public function run()
    {
        if (!$this->modx->user) {
            return;
        }
        if (!($this->modx->user->hasSessionContext('mgr') || $this->modx->user->hasSessionContext($this->modx->resource->context_key))) {
            return;
        }
        if (!$this->modx->hasPermission('fred')) {
            return;
        }

        $fredMode = $this->modx->getOption('fred.default_enabled', $this->sp, 1);

        if (isset($_SESSION['fred'])) {
            $fredMode = intval($_SESSION['fred']);
        }

        $_SESSION['fred'] = $fredMode;
    }
}
