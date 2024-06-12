<?php

namespace Fred\v2\Endpoint\Ajax;

class LoadBlueprint extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\LoadBlueprint;

    protected $allowedMethod = ['GET', 'OPTIONS'];
    private $blueprintClass = 'FredBlueprint';
    private $elementClass = 'FredElement';
}
