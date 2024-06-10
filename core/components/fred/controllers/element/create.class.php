<?php

/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

require_once dirname(dirname(dirname(__FILE__))) . '/index.class.php';

/**
 * @package fred
 * @subpackage controllers
 */
class FredElementCreateManagerController extends FredBaseManagerController
{
    public function process(array $scriptProperties = [])
    {
    }

    public function getPageTitle()
    {
        return $this->modx->lexicon('fred.elements.create');
    }

    public function loadCustomCssJs()
    {
        $this->addJavascript($this->fred->getOption('jsUrl') . 'home/widgets/element_option_set.window.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'element/panel.js');
        $this->addLastJavascript($this->fred->getOption('jsUrl') . 'element/page.js');

        $this->addHtml('
        <script type="text/javascript">
            Ext.onReady(function() {
                MODx.load({ 
                    xtype: "fred-page-element"
                });
            });
        </script>
        ');

        $this->modx->invokeEvent('FredElementFormRender');
    }

    public function getTemplateFile()
    {
        return $this->fred->getOption('templatesPath') . 'element.tpl';
    }

    public function checkPermissions()
    {
        if (!$this->modx->hasPermission('fred_element_save')) {
            return false;
        }

        return parent::checkPermissions();
    }
}
