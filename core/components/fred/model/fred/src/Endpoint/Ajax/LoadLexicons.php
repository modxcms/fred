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

use Fred\Utils;

class LoadLexicons extends Endpoint
{
    protected $allowedMethod = ['OPTIONS', 'GET'];
    
    public function process()
    {
        $topics = !empty($_GET['topics']) ? $_GET['topics'] : '';
        $topics = Utils::explodeAndClean($topics);
        
        foreach ($topics as $topic) {
            $this->modx->lexicon->load($topic);
        }
        
        $this->modx->lexicon->load('fred:fe');

        return $this->data($this->modx->lexicon->fetch());
    }
}