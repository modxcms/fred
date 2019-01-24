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

use Firebase\JWT\JWT;

class Ajax extends Endpoint
{
    public function run()
    {
        if (!$this->modx->user) {
            http_response_code(401);
            return;
        }

        if (empty($_SERVER['HTTP_X_FRED_TOKEN'])) {
            http_response_code(403);
            return;
        }

        try {
            $payload = JWT::decode($_SERVER['HTTP_X_FRED_TOKEN'], $this->fred->getSecret(), ['HS256']);
            $payload = (array)$payload;

            $this->modx->switchContext($payload['context']);
            
            if (!$this->modx->hasPermission('fred')) {
                http_response_code(403);
                return;
            }
            
            if ($payload['iss'] !== $this->modx->user->id) {
                http_response_code(403);
                return;    
            }
        } catch (\Exception $e) {
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

        /** @var Ajax\Endpoint $ajaxEndpoint */
        $ajaxEndpoint = new $className($this->fred, $payload);

        header('Content-Type: application/json; charset=UTF-8');

        echo $ajaxEndpoint->run();

        return;
    }
}