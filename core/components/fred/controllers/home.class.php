<?php
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