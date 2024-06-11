<?php

/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Fred\v2\Endpoint;


abstract class Endpoint
{
    /** @var \modX */
    protected $modx;

    /** @var \Fred */
    protected $fred;

    /**
     * Endpoint constructor.
     * @param Fred $fred
     */
    public function __construct(\Fred &$fred)
    {
        $this->fred =& $fred;
        $this->modx =& $fred->modx;
    }

    abstract public function run();
}
