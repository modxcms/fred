<?php

namespace Fred\Elements\Event;

use Fred\Model\FredThemedTemplate;

class OnTemplateRemove extends Event
{
    use \Fred\Traits\Elements\Event\OnTemplateRemove;

    private $themedTemplateClass = FredThemedTemplate::class;
}
