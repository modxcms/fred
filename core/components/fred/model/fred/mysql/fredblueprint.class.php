<?php
/**
 * @package fred
 */
require_once (strtr(realpath(dirname(dirname(__FILE__))), '\\', '/') . '/fredblueprint.class.php');
class FredBlueprint_mysql extends FredBlueprint {}
?>