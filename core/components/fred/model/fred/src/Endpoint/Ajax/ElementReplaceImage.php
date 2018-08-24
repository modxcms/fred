<?php

namespace Fred\Endpoint\Ajax;


class ElementReplaceImage extends Endpoint
{
    function process()
    {
        $elementId = isset($this->body['element']) ? $this->body['element'] : '';
        
        if (empty($elementId)) {
            return $this->failure('No element was provided');
        }
        
        if (empty($this->body['image'])) {
            return $this->failure('No image was provided');
        }

        $element = $this->modx->getObject('FredElement', ['uuid' => $elementId]);
        
        if ($element) {
            $path = $this->fred->getOption('generated_images_path');
            $url = $this->fred->getOption('generated_images_url');
    
            $path = str_replace('{assets_path}', $this->modx->getOption('assets_path'), $path);
            $url = str_replace('{assets_url}', $this->modx->getOption('assets_url'), $url);

            $path = str_replace('//', '/', $path);
            $url = str_replace('//', '/', $url);
            
            $path = rtrim($path, '/') . '/';
            $url = rtrim($url, '/') . '/';

            $nfp = $this->modx->getOption('new_folder_permissions');
            $amode = !empty($nfp) ? octdec($this->modx->getOption('new_folder_permissions')) : 0777;
            if (!is_dir($path)) {
                mkdir($path, $amode, true);
            }
            
            $fileName = 'element_' . $element->id . '_' . time() . '.png';
            
            $img = $this->body['image'];
            $img = str_replace('data:image/png;base64,', '', $img);
            $img = str_replace(' ', '+', $img);
            $data = base64_decode($img);
            $file = $path . $fileName;
            file_put_contents($file, $data);

            $element->set('image', $url . $fileName);


            $element->save();
           
            return $this->success();
        }

        return $this->failure('Saving Element failed.');
    }
}
