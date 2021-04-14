<?php
namespace Fred\Model;

use xPDO\xPDO;

/**
 * Class FredThemedTemplate
 *
 * @property integer $template
 * @property integer $theme
 * @property integer $default_blueprint
 *
 * @property \Fred\Model\FredTheme $Theme
 * @property \MODX\Revolution\modTemplate $Template
 * @property \Fred\Model\FredElementCategoryTemplateAccess[] $ElementCategoryTemplatesAccess
 *
 * @package Fred\Model
 */
class FredThemedTemplate extends \xPDO\Om\xPDOObject
{
}
