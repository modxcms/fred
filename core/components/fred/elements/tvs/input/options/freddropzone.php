<?php
$corePath = $modx->getOption('fred.core_path', null, $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');

$modx->smarty->assign('hide_input', 1);

return $modx->smarty->fetch($corePath . 'elements/tvs/input/tpl/freddropzone.options.tpl');