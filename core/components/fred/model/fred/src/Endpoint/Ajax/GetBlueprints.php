<?php

namespace Fred\Endpoint\Ajax;

class GetBlueprints extends Endpoint
{
    protected $allowedMethod = ['OPTIONS', 'GET'];
    
    public function process()
    {

        $widgets = [
            [
                "id" => 1,
                "title" => "2 column",
                "description" => "",
                "image" => "http://via.placeholder.com/150x150",
                "content" => "<div style='border:thin solid blue;float:left;min-height:100px;width:50%;' data-fred-dropzone=''></div><div style='border:thin solid green;float:left;min-height:100px;width:50%;' data-fred-dropzone=''></div>"
            ]
        ];
        
        return $this->data(['blueprints' => $widgets]);
    }
}