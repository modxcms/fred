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
class FredBlueprintUpdateManagerController extends FredBaseManagerController
{
    protected $permissions = [];

    public function process(array $scriptProperties = array())
    {
        $this->loadPermissions();
    }

    public function getPageTitle()
    {
        return $this->modx->lexicon('fred.blueprints.update');
    }

    public function loadCustomCssJs()
    {
        $this->addJavascript($this->fred->getOption('jsUrl') . 'blueprint/panel.js');
        $this->addLastJavascript($this->fred->getOption('jsUrl') . 'blueprint/page.js');

        $this->addHtml('
        <script type="text/javascript">
            Ext.onReady(function() {
                MODx.load({ 
                    xtype: "fred-page-blueprint",
                    permission: ' . json_encode($this->permissions) . '
                });
            });
        </script>
        ');
    }

    public function getTemplateFile()
    {
        return $this->fred->getOption('templatesPath') . 'blueprint.tpl';
    }

    public function checkPermissions()
    {
        if (!$this->modx->hasPermission('fred_blueprints_save')) {
            return false;
        }

        return parent::checkPermissions();
    }

    protected function loadPermissions()
    {
        $this->permissions = [
            'fred_blueprints_create_public' => (int)$this->modx->hasPermission('fred_blueprints_create_public'),
        ];
    }
}
