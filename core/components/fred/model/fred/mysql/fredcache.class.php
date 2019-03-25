<?php
/**
 * @package fred
 */
require_once (strtr(realpath(dirname(dirname(__FILE__))), '\\', '/') . '/fredcache.class.php');
class FredCache_mysql extends FredCache {}
?>