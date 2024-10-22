<?php

/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @package fred
 */
abstract class FredBaseManagerController extends modExtraManagerController
{
    public $fred;

    public function initialize()
    {
        if (!$this->modx->version) {
            $this->modx->getVersionData();
        }
        $version = (int) $this->modx->version['version'];
        if ($version > 2) {
            $this->fred = $this->modx->services->get('fred');
        } else {
            $corePath = $this->modx->getOption('fred.core_path', null, $this->modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');
            $this->fred = $this->modx->getService(
                'fred',
                'Fred',
                $corePath . 'model/fred/',
                [
                    'core_path' => $corePath
                ]
            );
        }

        $this->addCss($this->fred->getOption('cssUrl') . 'fred.css');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'fred.js');

        $this->addHtml('<script type="text/javascript">
            Ext.onReady(function() {
                fred.config = ' . $this->modx->toJSON($this->fred->options) . ';
                fred.config.modx = "' . $version . '";
            });
        </script>');

        if ($version < 3) {
            $this->addCss($this->fred->getOption('cssUrl') . 'shim.css');
            $this->addJavascript($this->fred->getOption('jsUrl') . 'utils/breadcrumbs.js');
        }

        $this->addJavascript($this->fred->getOption('jsUrl') . 'utils/utils.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'utils/combos.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'utils/fields.js');

        parent::initialize();
    }

    public function getLanguageTopics()
    {
        return ['fred:default'];
    }

    public function checkPermissions()
    {
        return $this->modx->hasPermission('fred');
    }
}
