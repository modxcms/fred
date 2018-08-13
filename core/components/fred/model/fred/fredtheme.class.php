<?php
/**
 * @property int $id
 * @property string $name
 * @property string $uuid
 * @property string $description
 * 
 * @package fred
 */
class FredTheme extends xPDOSimpleObject {
    public function save($cacheFlag = null)
    {
        $uuid = $this->get('uuid');

        if (empty($uuid)) {
            try {
                $this->set('uuid', \Fred\Utils::uuidFactory()->uuid4());
            } catch (Exception $e) {}
        }

        return parent::save($cacheFlag);
    }
}