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
    /** @var \Fred\Fred $fred */
    public $fred;

    public function initialize()
    {
        $this->fred = $this->modx->services->get('fred');

        $this->addCss($this->fred->getOption('cssUrl') . 'fred.css');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'fred.js');

        $this->addHtml('<script type="text/javascript">
            Ext.onReady(function() {
                fred.config = ' . $this->modx->toJSON($this->fred->options) . ';
            });
        </script>');

        $this->addJavascript($this->fred->getOption('jsUrl') . 'utils/utils.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'utils/combos.js');
        $this->addJavascript($this->fred->getOption('jsUrl') . 'utils/fields.js');

        parent::initialize();
    }

    public function getLanguageTopics()
    {
        return array('fred:default');
    }

    public function checkPermissions()
    {
        return $this->modx->hasPermission('fred');
    }
}
