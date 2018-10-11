<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

require_once dirname(__FILE__) . '/model/fred/fred.class.php';

/**
 * @package fred
 */
abstract class FredBaseManagerController extends modExtraManagerController
{
    /** @var Fred $fred */
    public $fred;

    public function initialize()
    {
        $corePath = $this->modx->getOption('fred.core_path', null, $this->modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/fred/');
        $this->fred = $this->modx->getService(
            'fred',
            'Fred',
            $corePath . 'model/fred/',
            array(
                'core_path' => $corePath
            )
        );
        

        $this->addCss($this->fred->getOption('cssUrl') . 'fred.css');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'fred.js');

        $this->addHtml('<script type="text/javascript">
            Ext.onReady(function() {
                fred.config = ' . $this->modx->toJSON($this->fred->options) . ';
                fred.config.connector_url = "' . $this->fred->getOption('connectorUrl') . '";
            });
        </script>');

        parent::initialize();
    }

    public function getLanguageTopics()
    {
        return array('fred:default');
    }

    public function checkPermissions()
    {
        return $this->modx->hasPermission('fred_cmp');
    }
}