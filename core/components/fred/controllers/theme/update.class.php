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
class FredThemeUpdateManagerController extends FredBaseManagerController
{
    public function process(array $scriptProperties = [])
    {
    }

    public function getPageTitle()
    {
        return $this->modx->lexicon('fred.themes.update');
    }

    public function loadCustomCssJs()
    {
        $this->addJavascript($this->fred->getOption('jsUrl') . 'theme/panel.js');
        $this->addLastJavascript($this->fred->getOption('jsUrl') . 'theme/page.js');

        $this->addHtml('
        <script type="text/javascript">
            Ext.onReady(function() {
                MODx.load({
                    xtype: "fred-page-theme",
                });
            });
        </script>
        ');

        $this->modx->invokeEvent('FredThemeFormRender');
    }

    public function getTemplateFile()
    {
        return $this->fred->getOption('templatesPath') . 'theme.tpl';
    }

    public function checkPermissions()
    {
        if (!$this->modx->hasPermission('fred_themes_save')) {
            return false;
        }

        return parent::checkPermissions();
    }
}
