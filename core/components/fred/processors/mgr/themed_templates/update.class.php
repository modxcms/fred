<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredThemedTemplatesUpdateProcessor extends modObjectUpdateProcessor
{
    public $classKey = 'FredThemedTemplate';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.theme';
    public $primaryKeyField = 'template';
    /** @var FredThemedTemplate $object */
    public $object;

    public function beforeSet()
    {
        $theme = $this->getProperty('theme');
        
        if (empty($theme)) {
            $this->addFieldError('theme', $this->modx->lexicon('fred.err.theme_ns_name'));
        }

        return parent::beforeSet();
    }
}

return 'FredThemedTemplatesUpdateProcessor';