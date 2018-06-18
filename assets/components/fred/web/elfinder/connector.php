<?php

require_once dirname(dirname(dirname(dirname(dirname(dirname(__FILE__)))))) . '/config.core.php';
require_once MODX_CORE_PATH.'model/modx/modx.class.php';

$modx = new modX();
$modx->initialize('web');
$modx->getService('error','error.modError', '', '');

include_once dirname(dirname(__FILE__)) . '/vendor/elfinder/php/autoload.php';

$roots = [];

$mediaSourceIDs = $modx->getOption('mediaSource', $_GET, '');
$mediaSourceIDs = explode(',', $mediaSourceIDs);
$mediaSourceIDs = array_map('trim', $mediaSourceIDs);
$mediaSourceIDs = array_map('intval', $mediaSourceIDs);
$mediaSourceIDs = array_keys(array_flip($mediaSourceIDs));
$mediaSourceIDs = array_filter($mediaSourceIDs);

$c = $modx->newQuery('modMediaSource');
$where = [];

if (!empty($mediaSourceIDs)) {
    $where['id:IN'] = $mediaSourceIDs;
}

$c->where($where);

/** @var modMediaSource[] $mediaSources */
$mediaSources = $modx->getIterator('modMediaSource', $c);
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

$options = ['roots' => $roots];
$connector = new elFinderConnector(new elFinder($options));
$connector->run();