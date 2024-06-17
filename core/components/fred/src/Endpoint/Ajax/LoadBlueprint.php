<?php

namespace Fred\Endpoint\Ajax;

use Fred\Model\FredBlueprint;
use Fred\Model\FredElement;

class LoadBlueprint extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\LoadBlueprint;

    protected $allowedMethod = ['GET', 'OPTIONS'];
    private $blueprintClass = FredBlueprint::class;
    private $elementClass = FredElement::class;
}
