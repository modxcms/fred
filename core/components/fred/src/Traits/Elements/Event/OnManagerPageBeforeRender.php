<?php

namespace Fred\Traits\Elements\Event;

trait OnManagerPageBeforeRender
{
    public function run()
    {
        $this->modx->controller->addLexiconTopic('fred:default');
    }
}
