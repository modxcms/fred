<?php

namespace Fred\Elements\Event;

class OnDocFormSave extends Event
{
    use \Fred\Traits\Elements\Event\OnDocFormSave;

    private $renderResource = \Fred\RenderResource::class;
}
