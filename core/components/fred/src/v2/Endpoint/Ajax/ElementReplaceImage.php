<?php

namespace Fred\v2\Endpoint\Ajax;

class ElementReplaceImage extends Endpoint
{
    public function process()
    {
        if (!$this->modx->hasPermission('fred_element_screenshot')) {
            return $this->failure($this->modx->lexicon('fred.fe.err.permission_denied'));
        }

        $elementId = isset($this->body['element']) ? $this->body['element'] : '';

        if (empty($elementId)) {
            return $this->failure($this->modx->lexicon('fred.fe.err.elements_ns_element'));
        }

        if (empty($this->body['image'])) {
            return $this->failure($this->modx->lexicon('fred.fe.err.elements_ns_image'));
        }

        /** @var \FredElement $element */
        $element = $this->modx->getObject('FredElement', ['uuid' => $elementId]);

        if ($element) {
            /** @var \FredBlueprintCategory $categoryObject */
            $categoryObject = $element->Category;
            if (!$categoryObject) {
                return $this->failure($this->modx->lexicon('fred.fe.err.elements_ns_category'));
            }

            $theme = $categoryObject->Theme;
            if (!$theme) {
                return $this->failure($this->modx->lexicon('fred.fe.err.category_no_theme'));
            }

            $path = $theme->getThemeFolderPath() . 'generated/';

            $nfp = $this->modx->getOption('new_folder_permissions');
            $amode = !empty($nfp) ? octdec($this->modx->getOption('new_folder_permissions')) : 0777;
            if (!is_dir($path)) {
                mkdir($path, $amode, true);
            }

            $img = $this->body['image'];

            $type = [];
            $isImage = preg_match('/^data:image\/([^;]+);base64,/', $img, $type);
            $imageExtension = null;
            if ($isImage) {
                if (isset($type) && isset($type[1]) && (in_array(strtolower($type[1]), ['jpg', 'jpeg', 'png']))) {
                    $imageExtension = strtolower($type[1]);
                }
            }

            if (empty($imageExtension)) {
                return $this->failure($this->modx->lexicon('fred.fe.err.elements_incorrect_image_type'));
            }

            $fileName = 'element_' . $element->id . '.' . $imageExtension;

            $img = preg_replace('/^data:image\/[^;]+;base64,/', '', $img);
            $img = str_replace(' ', '+', $img);
            $data = base64_decode($img);
            $file = $path . $fileName;
            file_put_contents($file, $data);

            $element->set('image', '{{theme_dir}}generated/' . $fileName . '?timestamp=' . time());

            $element->save();

            return $this->success();
        }

        return $this->failure($this->modx->lexicon('fred.fe.err.elements_save'));
    }
}
