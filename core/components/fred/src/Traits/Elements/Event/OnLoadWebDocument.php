<?php

namespace Fred\Traits\Elements\Event;

use Fred\Traits\User;

trait OnLoadWebDocument
{
    use User;
    public function run()
    {
        if (!$this->canFred()) {
            return;
        }
        if ($_GET['fred'] && intval($_GET['fred']) !== 2) {
            return;
        }
        $this->modx->resource->set('cacheable', 0);
    }
}
