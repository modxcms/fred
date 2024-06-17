<?php

namespace Fred\v2\Elements\Event;

class OnTemplateRemove extends Event
{
    use \Fred\Traits\Elements\Event\OnTemplateRemove;

    private $themedTemplateClass = 'FredThemedTemplate';
}
