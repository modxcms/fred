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
 * @property int $rank
 * @property boolean $public
 * @property int $createdBy
 * 
 * @property modUser User
 * @property FredBlueprint[] Blueprints
 * @property FredTheme $Theme
 * 
 * @package fred
 */
class FredBlueprintCategory extends xPDOSimpleObject {}