<?php
/**
 * @var \MODX\Revolution\modX $modx
 * @var array $namespace
 */
require_once $namespace['path'] . 'vendor/autoload.php';

$modx->addPackage('Fred\Model', $namespace['path'] . 'src/', null, 'Fred\\');

$modx->services->add('fred', function($c) use ($modx) {
    return new Fred\Fred($modx);
});
