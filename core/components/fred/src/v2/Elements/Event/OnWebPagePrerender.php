<?php

namespace Fred\v2\Elements\Event;

class OnWebPagePrerender extends Event
{
    use \Fred\Traits\Elements\Event\OnWebPagePrerender;

    private $elementRTEConfigClass = 'FredElementRTEConfig';
    private $fredClass = \Fred::class;
}
