<?php

namespace Fred\Endpoint;

class Ajax extends Endpoint
{
    public function run()
    {
        $action = $this->modx->getOption('action', $_REQUEST, '');
        if (empty($action)) return;

        $action = str_replace('/', '', $action);
        $action = str_replace('\\', '', $action);
        $action = explode('-', $action);
        $action = array_map('ucfirst', $action);
        $action = implode('', $action);

        $className = "\\Fred\\Endpoint\\Ajax\\{$action}";
        if (class_exists($className) !== true) {
            http_response_code(404);
            return;
        }

        /** @var Endpoint $ajaxEndpoint */
        $ajaxEndpoint = new $className($this->fred);

        header('Content-Type: application/json; charset=UTF-8');

        echo $ajaxEndpoint->run();

        return;
    }
}