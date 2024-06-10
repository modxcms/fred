<?php

namespace Fred\Elements\Event;

class OnTVInputRenderList extends Event
{
    public function run()
    {
        $corePath = $this->modx->getOption('fred.core_path', null, $this->modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');
        $this->modx->event->output($corePath . 'elements/tvs/input/');
    }
}
