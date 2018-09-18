<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

require_once dirname(dirname(dirname(dirname(__FILE__)))) . '/index.class.php';

/**
 * @package fred
 * @subpackage controllers
 */
class FredElementRTEConfigUpdateManagerController extends FredBaseManagerController
{
    public function process(array $scriptProperties = [])
    {
    }

    public function getPageTitle()
    {
        return $this->modx->lexicon('fred.element_rte_configs.update');
    }

    public function loadCustomCssJs()
    {
        $this->addJavascript($this->fred->getOption('jsUrl') . 'utils/utils.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'utils/combos.js');
        
        $this->addJavascript($this->fred->getOption('jsUrl') . 'element_rte_config/panel.js');
        $this->addLastJavascript($this->fred->getOption('jsUrl') . 'element_rte_config/page.js');

        $this->addHtml('
        <script type="text/javascript">
            Ext.onReady(function() {
                MODx.load({ 
                    xtype: "fred-page-element-rte-config"
                });
            });
        </script>
        ');
    }

    public function getTemplateFile()
    {
        return $this->fred->getOption('templatesPath') . 'element_rte_config.tpl';
    }

}