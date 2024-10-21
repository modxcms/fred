<?php

namespace Fred\Model;

use xPDO\xPDO;

/**
 * Class FredBlueprint
 *
 * @property string $name
 * @property string $uuid
 * @property string $description
 * @property string $image
 * @property integer $category
 * @property integer $rank
 * @property boolean $complete
 * @property boolean $public
 * @property integer $createdBy
 * @property array $data
 *
 * @property \MODX\Revolution\modUser $User
 * @property \Fred\Model\FredBlueprintCategory $Category
 * @property \Fred\Model\FredBlueprintTemplateAccess[] $BlueprintTemplatesAccess
 *
 * @package Fred\Model
 */
class FredBlueprint extends \xPDO\Om\xPDOSimpleObject
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
