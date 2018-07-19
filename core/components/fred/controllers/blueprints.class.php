<?php
/*
 * This file is part of the Fred package.
 *
 * Copyright (c) MODX, LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

require_once dirname(dirname(__FILE__)) . '/index.class.php';

/**
 * @package fred
 * @subpackage controllers
 */
class FredBlueprintsManagerController extends FredBaseManagerController
{
    public function process(array $scriptProperties = array())
    {

    }

    public function getPageTitle()
    {
        return $this->modx->lexicon('fred.menu.blueprints');
    }

    public function loadCustomCssJs()
    {
        $this->addJavascript($this->fred->getOption('jsUrl') . 'blueprints/widgets/blueprint.window.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'blueprints/widgets/category.window.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'blueprints/widgets/categories.grid.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'blueprints/widgets/blueprints.grid.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'blueprints/panel.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'blueprints/page.js');
        
        $this->addJavascript($this->fred->getOption('jsUrl') . 'utils/griddraganddrop.js');
        $this->addLastJavascript($this->fred->getOption('jsUrl') . 'utils/combos.js');

        $this->addHtml('
        <script type="text/javascript">
            Ext.onReady(function() {
                MODx.load({ xtype: "fred-page-blueprints"});
            });
        </script>
        ');
    }

    public function getTemplateFile()
    {
        return $this->fred->getOption('templatesPath') . 'blueprints.tpl';
    }

}