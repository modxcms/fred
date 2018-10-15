<?php

/**
 * @package fred
 * @subpackage processors
 */
class FredThemedTemplatesRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'FredThemedTemplate';
    public $languageTopics = array('fred:default');
    public $objectType = 'fred.themed_templates';
    public $primaryKeyField = 'template';

    public function initialize()
    {
        if (!$this->modx->hasPermission('fred_themed_templates_delete')) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }
}

return 'FredThemedTemplatesRemoveProcessor';