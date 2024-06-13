<?php

namespace Fred\Elements\Event;

use Firebase\JWT\JWT;
use Fred\Fred;
use Fred\Model\FredElementRTEConfig;
use Wa72\HtmlPageDom\HtmlPageCrawler;

class OnWebPagePrerender extends Event
{
    use \Fred\Traits\Elements\Event\OnWebPagePrerender;

    private $elementRTEConfigClass = FredElementRTEConfig::class;
    private $fredClass = Fred::class;
}
