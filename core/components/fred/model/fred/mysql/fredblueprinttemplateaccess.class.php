<?php
/**
 * @package fred
 */
require_once (strtr(realpath(dirname(dirname(__FILE__))), '\\', '/') . '/fredblueprinttemplateaccess.class.php');
class FredBlueprintTemplateAccess_mysql extends FredBlueprintTemplateAccess {}
?>