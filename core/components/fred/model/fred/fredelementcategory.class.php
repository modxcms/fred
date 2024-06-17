<?php

/**
 * @package fred
 */
class FredElementCategory extends xPDOSimpleObject
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
}
