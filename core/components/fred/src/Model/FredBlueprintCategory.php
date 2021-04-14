<?php
namespace Fred\Model;

use xPDO\xPDO;

/**
 * Class FredBlueprintCategory
 *
 * @property string $name
 * @property string $uuid
 * @property integer $rank
 * @property integer $theme
 * @property boolean $public
 * @property integer $createdBy
 *
 * @property \MODX\Revolution\modUser $User
 * @property \Fred\Model\FredTheme $Theme
 * @property \Fred\Model\FredBlueprint[] $Blueprints
 * @property \Fred\Model\FredBlueprintCategoryTemplateAccess[] $BlueprintCategoryTemplatesAccess
 *
 * @package Fred\Model
 */
class FredBlueprintCategory extends \xPDO\Om\xPDOSimpleObject
{
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
}
