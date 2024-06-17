<?php

namespace Fred\v2\Endpoint\Ajax;

class GetThemedTemplates extends Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\GetThemedTemplates;

    protected $allowedMethod = ['OPTIONS', 'GET'];
    private $themedTemplateClass = 'FredThemedTemplate';
    private $templateClass = 'modTemplate';
}
