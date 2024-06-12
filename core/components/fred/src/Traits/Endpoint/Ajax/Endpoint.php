<?php

/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fred\Traits\Endpoint\Ajax;

trait Endpoint
{
    public function run()
    {
        if (!$this->modx->user) {
            http_response_code(401);
            return '';
        }

        if (!$this->modx->hasPermission('fred')) {
            http_response_code(403);
            return '';
        }

        /** @var bool|string $checked */
        $checked = $this->checkMethod();
        if ($checked !== true) {
            return $checked;
        }

        if ($this->method === 'POST') {
            $this->body = json_decode(file_get_contents('php://input'), true);
        }

        $this->modx->lexicon->load('fred:fe');

        return $this->process();
    }

    /**
     * @param string|array $message
     * @param array $fields
     * @return string
     */
    protected function failure($message, $fields = [])
    {
        http_response_code(400);

        if (!is_array($message)) {
            $message = ['message' => $message];
        }

        $message['_fields'] = $fields;

        return json_encode($message);
    }

    /**
     * @param string|array $message
     * @return string
     */
    protected function success($message = '')
    {
        http_response_code(200);

        if (!is_array($message)) {
            $message = ['message' => $message];
        }

        return json_encode($message);
    }

    /**
     * @param array $data
     * @param array $meta
     * @return string
     */
    protected function data($data, $meta = [])
    {
        http_response_code(200);

        $meta['data'] = $data;

        return json_encode($meta);
    }

    protected function checkMethod()
    {
        $this->method = strtoupper($_SERVER['REQUEST_METHOD']);

        if (in_array($this->method, $this->allowedMethod)) {
            return true;
        }

        http_response_code(405);
        return '{}';
    }

    protected function verifyClaim($name, $value)
    {
        if (!isset($this->jwtPayload[$name])) {
            return false;
        }

        return $this->jwtPayload[$name] === $value;
    }

    protected function getClaim($name)
    {
        if (!isset($this->jwtPayload[$name])) {
            return false;
        }

        return $this->jwtPayload[$name];
    }
}
