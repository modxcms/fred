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
 * @property string $description
 * @property string $image
 * @property int $category
 * @property int $rank
 * @property boolean $public
 * @property boolean $complete
 * @property int $createdBy
 * 
 * @property FredBlueprintCategory $Category
 * @property modUser $User
 * 
 * @package fred
 */
class FredBlueprint extends xPDOSimpleObject {}