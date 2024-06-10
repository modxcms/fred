<?php

namespace Fred\Elements\Event;

class OnManagerPageBeforeRender extends Event
{
    public function run()
    {
        $this->modx->controller->addLexiconTopic('fred:default');
    }
}
