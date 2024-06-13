<?php

namespace Fred\v2\Elements\Event;

use Firebase\JWT\JWT;
use Wa72\HtmlPageDom\HtmlPageCrawler;

class OnWebPagePrerender extends Event
{
    use \Fred\Traits\Elements\Event\OnWebPagePrerender;

    private $elementRTEConfigClass = 'FredElementRTEConfig';
    private $fredClass = \Fred::class;
}
