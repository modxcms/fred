<?php
namespace Fred\Model;

use xPDO\xPDO;

/**
 * Class FredElementRTEConfig
 *
 * @property string $name
 * @property string $description
 * @property integer $theme
 * @property array $data
 *
 * @property \Fred\Model\FredTheme $Theme
 *
 * @package Fred\Model
 */
class FredElementRTEConfig extends \xPDO\Om\xPDOSimpleObject
{
    public function getContent()
    {
        return $this->data;
    }
}
