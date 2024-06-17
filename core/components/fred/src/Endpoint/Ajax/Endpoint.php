<?php

/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fred\Endpoint\Ajax;

use Fred\Fred;
use MODX\Revolution\modX;

abstract class Endpoint
{
    use \Fred\Traits\Endpoint\Ajax\Endpoint;

    /** @var modX */
    protected $modx;

    /** @var Fred */
    protected $fred;

    /** @var string */
    protected $method;

    /** @var array */
    protected $body;

    /** @var array */
    protected $allowedMethod = ['POST', 'OPTIONS'];

    /** @var bool */
    protected $taggerLoaded = false;

    /** @var \Tagger\Tagger|null */
    protected $tagger = null;

    /** @var array */
    private $jwtPayload = [];

    /**
     * Endpoint constructor.
     * @param Fred $fred
     * @param $payload
     */
    public function __construct(Fred &$fred, $payload)
    {
        $this->fred =& $fred;
        $this->modx =& $fred->modx;
        $this->jwtPayload = $payload;
    }

    /**
     * @return string
     */
    abstract public function process();

    /**
     * @param string|array $message
     * @param array $fields
     * @return string
     */

    protected function loadTagger()
    {
        $this->taggerLoaded = $this->modx->services->has('tagger');

        if ($this->taggerLoaded) {
            $this->tagger = $this->modx->services->get('tagger');
        }
    }
}
