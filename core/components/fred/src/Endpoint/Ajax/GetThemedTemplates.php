<?php

namespace Fred\Endpoint\Ajax;

use Fred\Model\FredThemedTemplate;
use MODX\Revolution\modTemplate;

class GetThemedTemplates extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\GetThemedTemplates;

    protected $allowedMethod = ['OPTIONS', 'GET'];
    private $themedTemplateClass = FredThemedTemplate::class;
    private $templateClass = modTemplate::class;
}
