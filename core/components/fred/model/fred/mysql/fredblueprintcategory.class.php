<?php
/**
 * @package fred
 */
require_once (strtr(realpath(dirname(dirname(__FILE__))), '\\', '/') . '/fredblueprintcategory.class.php');
class FredBlueprintCategory_mysql extends FredBlueprintCategory {}
?>