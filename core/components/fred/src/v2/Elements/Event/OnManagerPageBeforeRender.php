<?php

namespace Fred\v2\Elements\Event;

class OnManagerPageBeforeRender extends Event
{
    public function run()
    {
        $this->modx->controller->addLexiconTopic('fred:default');
    }
}
