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
 * @property int $id
 * @property string $name
 * @property string $uuid
 * @property int $rank
 * @property int $theme
 * 
 * @property FredTheme $Theme
 * @property FredElement[] $Elements
 * 
 * @package fred
 */
class FredElementCategory extends xPDOSimpleObject {
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