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
class FredElementOptionSetCreateManagerController extends FredBaseManagerController
{
    public function process(array $scriptProperties = [])
    {
    }

    public function getPageTitle()
    {
        return $this->modx->lexicon('fred.menu.elements');
    }

    public function loadCustomCssJs()
    {
        $this->addJavascript($this->fred->getOption('jsUrl') . 'element_option_set/panel.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'element_option_set/page.js');
        
        $this->addLastJavascript($this->fred->getOption('jsUrl') . 'utils/combos.js');

        $this->addHtml('
        <script type="text/javascript">
            Ext.onReady(function() {
                MODx.load({ 
                    xtype: "fred-page-element-option-set"
                });
            });
        </script>
        ');
    }

    public function getTemplateFile()
    {
        return $this->fred->getOption('templatesPath') . 'element_option_set.tpl';
    }

}