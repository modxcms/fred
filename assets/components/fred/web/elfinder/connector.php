<?php

require_once dirname(dirname(dirname(dirname(dirname(dirname(__FILE__)))))) . '/config.core.php';
require_once MODX_CORE_PATH.'model/modx/modx.class.php';

$modx = new modX();
$modx->initialize('web');
$modx->getService('error','error.modError', '', '');

include_once dirname(dirname(__FILE__)) . '/vendor/elfinder/php/autoload.php';

$roots = [];

$mediaSources = $modx->getIterator('modMediaSource');
foreach ($mediaSources as $mediaSource) {
    $mediaSource->initialize();
    $properties = $mediaSource->getProperties();

    if (isset($properties['fred']) && ($properties['fred']['value'] === true)) {
        $bases = $mediaSource->getBases();
        
        $path = $bases['pathAbsoluteWithPath'];
        $url =  $bases['urlAbsoluteWithPath'];

        $readOnly = false;
        if (isset($properties['fredReadOnly']) && ($properties['fredReadOnly']['value'] === true)) $readOnly = true;

        $roots[] = [
            'id' => 'ms' . $mediaSource->id,
            'driver' => 'LocalFileSystem',
            'alias' => $mediaSource->name,
            'path' => $path,
            'URL' => $url,
            'tmbPath' => '.tmb',
            'startPath' => $path,
            'disabled' => $readOnly ? array('rename', 'rm', 'cut', 'copy') : [],
            'attributes' => [
                [
                    'pattern' => '/.*/',
                    'read'    => true,
                    'write'   => !$readOnly,
                    'locked'  => false
                ]
            ]
        ];

    }
}

$opts = array('roots' => $roots);
$connector = new elFinderConnector(new elFinder($opts));
$connector->run();