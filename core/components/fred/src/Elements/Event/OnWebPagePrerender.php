<?php

namespace Fred\Elements\Event;

use Fred\Fred;
use Fred\Model\FredElementRTEConfig;

class OnWebPagePrerender extends Event
{
    use \Fred\Traits\Elements\Event\OnWebPagePrerender;

    private $elementRTEConfigClass = FredElementRTEConfig::class;
    private $fredClass = Fred::class;
}
