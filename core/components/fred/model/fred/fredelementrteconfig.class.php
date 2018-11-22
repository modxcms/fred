<?php
/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property array $data
 * @property int $theme
 * 
 * @property FredTheme $Theme
 * 
 * @package fred
 */
class FredElementRTEConfig extends xPDOSimpleObject {
    public function getContent()
    {
        return $this->data;
    }
}