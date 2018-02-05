<?php

namespace Fred\Endpoint\Ajax;

class GetAtoms extends Endpoint
{
    protected $allowedMethod = ['OPTIONS', 'GET'];
    
    public function process()
    {

        $widgets = [
            [
                "id" => 1,
                "title" => "Header #2",
                "description" => "",
                "image" => "http://via.placeholder.com/150x150",
                "content" => "<h2 contenteditable=\"true\" data-fred-name=\"header\">Header 2</h2>"
            ],
            [
                "id" => 2,
                "title" => "Text",
                "description" => "",
                "image" => "http://via.placeholder.com/300x70",
                "content" => "<p contenteditable=\"true\" data-fred-name=\"description\">Description Only</p>"
            ],
            [
                "id" => 2,
                "title" => "Image",
                "description" => "",
                "image" => "http://via.placeholder.com/150x150",
                "content" => "<img src='http://via.placeholder.com/150x150'>"
            ]
        ];
        
        return $this->data(['atoms' => $widgets]);
    }
}