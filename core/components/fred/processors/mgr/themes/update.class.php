<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredThemeUpdateProcessor extends modObjectUpdateProcessor
{
    public $classKey = 'FredTheme';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.theme';
    /** @var FredTheme $object */
    public $object;

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_themes_save')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }
    
    public function beforeSet()
    {
        $name = $this->getProperty('name');

        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('fred.err.theme_ns_name'));
        }

        return parent::beforeSet();
    }
}

return 'FredThemeUpdateProcessor';