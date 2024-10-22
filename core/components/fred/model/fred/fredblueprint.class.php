<?php

/**
 * @package fred
 */
class FredBlueprint extends xPDOSimpleObject
{
    public function save($cacheFlag = null)
    {
        $uuid = $this->get('uuid');

        if (empty($uuid)) {
            try {
                $this->set('uuid', \Fred\Utils::uuid());
            } catch (\Exception $e) {
            }
        }

        return parent::save($cacheFlag);
    }

    public function getImage()
    {
        $image = 'https://placehold.co/350x150?text=' . urlencode($this->name);

        if (!empty($this->image)) {
            $image = $this->image;

            $category = $this->Category;
            if ($category) {
                $theme = $category->Theme;
                if ($theme) {
                    $image = str_replace('{{theme_dir}}', $theme->getThemeFolderUri(), $image);
                }
            }

            $image = str_replace('{{assets_url}}', $this->xpdo->getOption('assets_url'), $image);

            if ((strtolower(substr($image, 0, 7)) !== 'http://') && (strtolower(substr($image, 0, 8)) !== 'https://') && (substr($image, 0, 2) !== '//')  && (substr($image, 0, 1) !== '/')) {
                $image = $this->xpdo->getOption('base_url') . $image;
            }
        }

        return $image;
    }

    public function getContent()
    {
        return $this->data;
    }
}
