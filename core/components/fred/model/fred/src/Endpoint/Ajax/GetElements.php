<?php

namespace Fred\Endpoint\Ajax;

class GetElements extends Endpoint
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
            ],
            [
                "id" => 2,
                "title" => "Header & Text",
                "description" => "",
                "image" => "http://via.placeholder.com/150x150",
                "content" => "<h2 contenteditable=\"true\" data-fred-name=\"header\">Header #2</h2><p contenteditable=\"true\" data-fred-name=\"description\">Description</p>"
            ],
            [
                "id" => 3,
                "title" => "Text & Dropzone",
                "description" => "",
                "image" => "http://via.placeholder.com/150x150",
                "content" => "<p contenteditable=\"true\" data-fred-name=\"description\">Description</p><br /><div style='border:thin solid blue;float:left;min-height:100px;width:50%;' data-fred-dropzone=''></div><div style='border:thin solid green;float:left;min-height:100px;width:50%;' data-fred-dropzone=''></div>"
            ]
        ];
        
        return $this->data(['elements' => $widgets]);
    }
}