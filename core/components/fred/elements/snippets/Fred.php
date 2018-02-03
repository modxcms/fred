<?php
/**
 * @param modX $modx
 */

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


$modx->regClientStartupScript($fred->getOption('webAssetsUrl') . 'fred.min.js');
$modx->regClientCSS($fred->getOption('webAssetsUrl') . 'fred.css');

$modx->regClientStartupHTMLBlock('
<script>
    var fred = new Fred({
        assetsUrl: "' .$fred->getOption('webAssetsUrl'). '",
        resource: {
            "id": ' . $modx->resource->id . '
        }
    });
</script>');