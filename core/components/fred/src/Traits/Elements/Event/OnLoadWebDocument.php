<?php

namespace Fred\Traits\Elements\Event;

use Fred\Traits\User;

trait OnLoadWebDocument
{
    use User;
    public function run()
    {
        if (!isset($_GET['fred'])) {
            return;
        }
        if (!$this->canFred()) {
            return;
        }
        $this->modx->resource->set('cacheable', 0);
    }
}
