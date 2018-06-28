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
 * Loads the home page.
 *
 * @package fred
 * @subpackage controllers
 */
class FredHomeManagerController extends FredBaseManagerController
{
    public function process(array $scriptProperties = array())
    {

    }

    public function getPageTitle()
    {
        return $this->modx->lexicon('fred');
    }

    public function loadCustomCssJs()
    {

    }

}