<?php
$templates = $modx->getOption('fred.template_ids');
$templates = explode(',', $templates);
$templates = array_map('trim', $templates);
$templates = array_flip($templates);

if (isset($templates[$modx->resource->template])) {
    if (isset($_GET['fred'])) {
        if (intval($_GET['fred']) === 0) return;
    }

    $corePath = $modx->getOption('fred.core_path', null, $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');
    /** @var Fred $fred */
    $fred = $modx->getService(
        'fred',
        'Fred',
        $corePath . 'model/fred/',
        array(
            'core_path' => $corePath
        )
    );

    $fredContent = '
    <script type="text/javascript" src="'.$fred->getOption('webAssetsUrl').'fred.min.js"></script>
    <link rel="stylesheet" href="'.$fred->getOption('webAssetsUrl').'fred.css" type="text/css" />
    <script>
        var fred = new Fred({
            assetsUrl: "' . $fred->getOption('webAssetsUrl') . '",
            launcherPosition: "' . $fred->getOption('launcher_position') . '",
            resource: {
                "id": ' . $modx->resource->id . '
            }
        });
    </script>';

    $modx->resource->_output = preg_replace('/(<\/head>(?:<\/head>)?)/i',"{$fredContent}\r\n$1", $modx->resource->_output);
}