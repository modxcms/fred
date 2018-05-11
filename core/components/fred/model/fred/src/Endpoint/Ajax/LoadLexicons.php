<?php

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