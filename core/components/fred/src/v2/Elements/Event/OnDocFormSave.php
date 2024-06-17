<?php

namespace Fred\v2\Elements\Event;

class OnDocFormSave extends Event
{
    use \Fred\Traits\Elements\Event\OnDocFormSave;

    private $renderResource = \Fred\v2\RenderResource::class;
}
