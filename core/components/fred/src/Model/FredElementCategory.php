<?php
namespace Fred\Model;

use xPDO\xPDO;

/**
 * Class FredElementCategory
 *
 * @property string $name
 * @property string $uuid
 * @property integer $rank
 * @property integer $theme
 *
 * @property \Fred\Model\FredTheme $Theme
 * @property \Fred\Model\FredElement[] $Elements
 * @property \Fred\Model\FredElementCategoryTemplateAccess[] $ElementCategoryTemplatesAccess
 *
 * @package Fred\Model
 */
class FredElementCategory extends \xPDO\Om\xPDOSimpleObject
{
    public function save($cacheFlag = null)
    {
        $uuid = $this->get('uuid');

        if (empty($uuid)) {
            try {
                $this->set('uuid', \Fred\Utils::uuid());
            } catch (\Exception $e) {}
        }

        return parent::save($cacheFlag);
    }
}
