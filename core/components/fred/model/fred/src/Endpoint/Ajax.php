<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fred\Endpoint;

class Ajax extends Endpoint
{
    public function run()
    {
        if (!$this->modx->user) {
            http_response_code(401);
            return;
        }

        if ($this->modx->user->sudo !== 1) {
            http_response_code(403);
            return;
        }
        
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