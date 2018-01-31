<?php

namespace Fred\Endpoint\Ajax;

class GetWidgets extends Endpoint
{
    protected $allowedMethod = ['OPTIONS', 'GET'];
    
    public function process()
    {

        $widgets = [
            [
                "id" => 1,
                "title" => "Container",
                "description" => "",
                "image" => "http://via.placeholder.com/150x150",
                "content" => "<div class=\"container\"><h2 contenteditable=\"true\" data-fred-name=\"header\">Header 2</h2><p contenteditable=\"true\" data-fred-name=\"description\">Description</p></div>"
            ],
            [
                "id" => 2,
                "title" => "2 Column",
                "description" => "Content Left. Component Right.",
                "image" => $this->fred->getOption('webAssetsUrl') . "layouts/two-column.jpeg",
                "content" => "<div class=\"container\"><div class=\"row\"><div class=\"col-6\"><h3>Can't Edit THIS</h3><img src=\"http://via.placeholder.com/350x150\" /><p contenteditable=\"true\" data-fred-name=\"description\">Description</p></div><div class=\"col-6\"><p contenteditable=\"true\" data-fred-name=\"description\">Description</p></div></div></div>"
            ],
            [
                "id" => 3,
                "title" => "Text",
                "description" => "",
                "image" => "http://via.placeholder.com/300x70",
                "content" => "<p contenteditable=\"true\" data-fred-name=\"description\">Description Only</p>"
            ]
        ];
        
        return $this->data(['widgets' => $widgets]);
    }
}