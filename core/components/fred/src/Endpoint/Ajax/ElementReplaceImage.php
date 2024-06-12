<?php

namespace Fred\Endpoint\Ajax;

use Fred\Model\FredElement;

class ElementReplaceImage extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\ElementReplaceImage;

    private $elementClass = FredElement::class;
}
