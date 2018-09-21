<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * 
 * @property int $id
 * @property string $name
 * @property string $uuid
 * @property string $description
 * @property string $image
 * @property int $category
 * @property int $rank
 * @property boolean $public
 * @property boolean $complete
 * @property int $createdBy
 * @property array $data
 * 
 * @property FredBlueprintCategory $Category
 * @property modUser $User
 * 
 * @package fred
 */
class FredBlueprint extends xPDOSimpleObject {
    public function save($cacheFlag = null)
    {
        $uuid = $this->get('uuid');

        if (empty($uuid)) {
            try {
                $this->set('uuid', \Fred\Utils::uuid());
            } catch (Exception $e) {}
        }

        return parent::save($cacheFlag);
    }

    public function getImage()
    {
        $image = 'https://via.placeholder.com/350x150?text=' . urlencode($this->name);

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

            if ((strtolower(substr($image, 0,7)) !== 'http://') && (strtolower(substr($image, 0,8)) !== 'https://') && (substr($image, 0,2) !== '//')  && (substr($image, 0,1) !== '/')) {
                $image = $this->xpdo->getOption('base_url') . $image;
            }
        }

        return $image;
    }
}