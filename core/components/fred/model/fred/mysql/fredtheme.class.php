<?php
/**
 * @package fred
 */
require_once (strtr(realpath(dirname(dirname(__FILE__))), '\\', '/') . '/fredtheme.class.php');
class FredTheme_mysql extends FredTheme {}
?>